const express = require("express")
const { getDB } = require("../config/database")
const { ObjectId } = require("mongodb")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")

const router = express.Router()

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = { ...req.user }
    delete user.password_hash // Extra safety

    res.json({ user })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update user profile
router.patch(
  "/profile",
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("phone_number").optional().isMobilePhone().withMessage("Valid phone number required"),
    body("address").optional().isObject(),
    body("preferences").optional().isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, phone_number, address, preferences } = req.body
      const db = getDB()

      const updateData = {}
      if (name) updateData.name = name
      if (phone_number) updateData.phone_number = phone_number
      if (address) updateData.address = address
      if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences }

      updateData.updated_at = new Date()

      const result = await db.collection("users").updateOne({ _id: req.user._id }, { $set: updateData })

      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "No changes made to profile" })
      }

      // Get updated user
      const updatedUser = await db
        .collection("users")
        .findOne({ _id: req.user._id }, { projection: { password_hash: 0 } })

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Change password
router.patch(
  "/change-password",
  [
    body("current_password").notEmpty().withMessage("Current password is required"),
    body("new_password").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { current_password, new_password } = req.body
      const db = getDB()

      // Get user with password
      const user = await db.collection("users").findOne({ _id: req.user._id })

      // Verify current password
      const isValidPassword = await bcrypt.compare(current_password, user.password_hash)
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" })
      }

      // Hash new password
      const saltRounds = 12
      const new_password_hash = await bcrypt.hash(new_password, saltRounds)

      // Update password
      await db
        .collection("users")
        .updateOne({ _id: req.user._id }, { $set: { password_hash: new_password_hash, updated_at: new Date() } })

      res.json({ message: "Password changed successfully" })
    } catch (error) {
      console.error("Error changing password:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Add favorite restaurant
router.post("/favorites/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params
    const db = getDB()

    // Verify restaurant exists
    const restaurant = await db.collection("restaurants").findOne({
      _id: new ObjectId(restaurantId),
      is_active: true,
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    // Add to favorites
    const result = await db
      .collection("users")
      .updateOne(
        { _id: req.user._id },
        { $addToSet: { "preferences.favorite_restaurants": new ObjectId(restaurantId) } },
      )

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Restaurant already in favorites" })
    }

    res.json({ message: "Restaurant added to favorites" })
  } catch (error) {
    console.error("Error adding favorite restaurant:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Remove favorite restaurant
router.delete("/favorites/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params
    const db = getDB()

    const result = await db
      .collection("users")
      .updateOne({ _id: req.user._id }, { $pull: { "preferences.favorite_restaurants": new ObjectId(restaurantId) } })

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Restaurant not in favorites" })
    }

    res.json({ message: "Restaurant removed from favorites" })
  } catch (error) {
    console.error("Error removing favorite restaurant:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get favorite restaurants
router.get("/favorites", async (req, res) => {
  try {
    const db = getDB()

    const user = await db
      .collection("users")
      .findOne({ _id: req.user._id }, { projection: { "preferences.favorite_restaurants": 1 } })

    if (!user?.preferences?.favorite_restaurants?.length) {
      return res.json({ favorites: [] })
    }

    const favorites = await db
      .collection("restaurants")
      .find({
        _id: { $in: user.preferences.favorite_restaurants },
        is_active: true,
      })
      .toArray()

    res.json({ favorites })
  } catch (error) {
    console.error("Error fetching favorite restaurants:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get user order history with stats
router.get("/order-history", async (req, res) => {
  try {
    const db = getDB()

    // Get order statistics
    const stats = await db
      .collection("orders")
      .aggregate([
        { $match: { user_id: req.user._id } },
        {
          $group: {
            _id: null,
            total_orders: { $sum: 1 },
            total_spent: { $sum: "$total_amount" },
            avg_order_value: { $avg: "$total_amount" },
            completed_orders: {
              $sum: { $cond: [{ $eq: ["$order_status", "delivered"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray()

    // Get recent orders
    const recent_orders = await db
      .collection("orders")
      .find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray()

    // Get restaurant details for recent orders
    for (const order of recent_orders) {
      const restaurant = await db
        .collection("restaurants")
        .findOne({ _id: order.restaurant_id }, { projection: { name: 1 } })
      order.restaurant_name = restaurant?.name
    }

    res.json({
      stats: stats[0] || {
        total_orders: 0,
        total_spent: 0,
        avg_order_value: 0,
        completed_orders: 0,
      },
      recent_orders,
    })
  } catch (error) {
    console.error("Error fetching order history:", error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
