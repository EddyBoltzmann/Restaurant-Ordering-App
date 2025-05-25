const express = require("express")
const { getDB } = require("../config/database")
const { ObjectId } = require("mongodb")
const { body, param, query, validationResult } = require("express-validator")

const router = express.Router()

// Create new order
router.post(
  "/",
  [
    body("restaurant_id").isMongoId().withMessage("Valid restaurant ID is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.item_id").isMongoId().withMessage("Valid item ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Valid quantity is required"),
    body("delivery_address").optional().isObject(),
    body("order_type").isIn(["app", "phone", "qr_code", "web"]).withMessage("Valid order type is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { restaurant_id, items, delivery_address, order_type, special_instructions } = req.body
      const db = getDB()
      const io = req.app.get("io")

      // Verify restaurant exists and is active
      const restaurant = await db.collection("restaurants").findOne({
        _id: new ObjectId(restaurant_id),
        is_active: true,
      })

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found or inactive" })
      }

      // Verify all menu items exist and calculate total
      let subtotal = 0
      const orderItems = []

      for (const item of items) {
        const menuItem = await db.collection("menuItems").findOne({
          _id: new ObjectId(item.item_id),
          restaurant_id: new ObjectId(restaurant_id),
          is_available: true,
        })

        if (!menuItem) {
          return res.status(400).json({
            error: `Menu item not found or unavailable: ${item.item_id}`,
          })
        }

        if (menuItem.stock_quantity < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${menuItem.name}. Available: ${menuItem.stock_quantity}`,
          })
        }

        const itemTotal = menuItem.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          item_id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          special_instructions: item.special_instructions || "",
        })
      }

      // Calculate totals
      const tax_rate = 0.08 // 8% tax
      const tax_amount = subtotal * tax_rate
      const delivery_fee = restaurant.delivery_fee || 0
      const total_amount = subtotal + tax_amount + delivery_fee

      // Create order
      const newOrder = {
        user_id: req.user._id,
        restaurant_id: new ObjectId(restaurant_id),
        order_type,
        order_status: "pending",
        items: orderItems,
        subtotal: Math.round(subtotal * 100) / 100,
        tax_amount: Math.round(tax_amount * 100) / 100,
        delivery_fee,
        discount_amount: 0,
        total_amount: Math.round(total_amount * 100) / 100,
        delivery_address: delivery_address || req.user.address,
        estimated_delivery_time: new Date(Date.now() + (restaurant.estimated_delivery_time || 30) * 60 * 1000),
        payment_status: "pending",
        loyalty_points_earned: Math.floor(total_amount),
        loyalty_points_used: 0,
        special_instructions: special_instructions || "",
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await db.collection("orders").insertOne(newOrder)

      // Update stock quantities
      for (const item of items) {
        await db
          .collection("menuItems")
          .updateOne({ _id: new ObjectId(item.item_id) }, { $inc: { stock_quantity: -item.quantity } })
      }

      // Emit real-time notification to restaurant
      io.to(`restaurant-${restaurant_id}`).emit("new-order", {
        order_id: result.insertedId,
        restaurant_id,
        total_amount: newOrder.total_amount,
        items_count: orderItems.length,
      })

      newOrder._id = result.insertedId
      res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      })
    } catch (error) {
      console.error("Error creating order:", error)
      res.status(500).json({ error: "Server error while creating order" })
    }
  },
)

// Get user's orders
router.get(
  "/my-orders",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    query("status").optional().isIn(["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]),
  ],
  async (req, res) => {
    try {
      const { page = 1, limit = 20, status } = req.query
      const db = getDB()

      const query_filter = { user_id: req.user._id }
      if (status) {
        query_filter.order_status = status
      }

      const skip = (page - 1) * limit

      const orders = await db
        .collection("orders")
        .find(query_filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      // Get restaurant details for each order
      for (const order of orders) {
        const restaurant = await db
          .collection("restaurants")
          .findOne({ _id: order.restaurant_id }, { projection: { name: 1, address: 1 } })
        order.restaurant = restaurant
      }

      const total = await db.collection("orders").countDocuments(query_filter)

      res.json({
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Error fetching user orders:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Get order by ID
router.get("/:id", [param("id").isMongoId().withMessage("Valid order ID is required")], async (req, res) => {
  try {
    const { id } = req.params
    const db = getDB()

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
      user_id: req.user._id,
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Get restaurant details
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: order.restaurant_id }, { projection: { name: 1, address: 1, contact_number: 1 } })

    order.restaurant = restaurant

    res.json({ order })
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update order status (for restaurant staff)
router.patch(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Valid order ID is required"),
    body("status")
      .isIn(["confirmed", "preparing", "ready", "delivered", "cancelled"])
      .withMessage("Valid status is required"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      const { id } = req.params
      const { status, notes } = req.body
      const db = getDB()
      const io = req.app.get("io")

      const order = await db.collection("orders").findOne({
        _id: new ObjectId(id),
      })

      if (!order) {
        return res.status(404).json({ error: "Order not found" })
      }

      // Update order status
      const updateData = {
        order_status: status,
        updated_at: new Date(),
      }

      if (notes) {
        updateData.notes = notes
      }

      if (status === "delivered") {
        updateData.actual_delivery_time = new Date()
      }

      const result = await db.collection("orders").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "Failed to update order status" })
      }

      // Emit real-time update to user
      io.to(`order-${id}`).emit("order-status-updated", {
        order_id: id,
        status,
        timestamp: new Date(),
      })

      res.json({
        message: "Order status updated successfully",
        order_id: id,
        new_status: status,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Cancel order
router.patch(
  "/:id/cancel",
  [param("id").isMongoId().withMessage("Valid order ID is required"), body("reason").optional().trim()],
  async (req, res) => {
    try {
      const { id } = req.params
      const { reason } = req.body
      const db = getDB()
      const io = req.app.get("io")

      const order = await db.collection("orders").findOne({
        _id: new ObjectId(id),
        user_id: req.user._id,
      })

      if (!order) {
        return res.status(404).json({ error: "Order not found" })
      }

      if (!["pending", "confirmed"].includes(order.order_status)) {
        return res.status(400).json({ error: "Order cannot be cancelled at this stage" })
      }

      // Update order status
      const result = await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            order_status: "cancelled",
            cancellation_reason: reason || "Cancelled by customer",
            updated_at: new Date(),
          },
        },
      )

      // Restore stock quantities
      for (const item of order.items) {
        await db.collection("menuItems").updateOne({ _id: item.item_id }, { $inc: { stock_quantity: item.quantity } })
      }

      // Emit real-time update
      io.to(`restaurant-${order.restaurant_id}`).emit("order-cancelled", {
        order_id: id,
        reason: reason || "Cancelled by customer",
      })

      res.json({
        message: "Order cancelled successfully",
        order_id: id,
      })
    } catch (error) {
      console.error("Error cancelling order:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

module.exports = router
