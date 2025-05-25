// Order-related database queries
const { ObjectId } = require("mongodb")

class OrderQueries {
  constructor(db) {
    this.db = db
    this.collection = db.collection("orders")
  }

  // Create a new order
  async createOrder(orderData) {
    try {
      const order = {
        ...orderData,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await this.collection.insertOne(order)
      return { success: true, orderId: result.insertedId }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    return await this.collection.findOne({ _id: new ObjectId(orderId) })
  }

  // Get user's orders
  async getUserOrders(userId, limit = 20, skip = 0) {
    return await this.collection
      .find({ user_id: new ObjectId(userId) })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()
  }

  // Get restaurant's orders
  async getRestaurantOrders(restaurantId, status = null, limit = 50) {
    const query = { restaurant_id: new ObjectId(restaurantId) }

    if (status) {
      query.order_status = status
    }

    return await this.collection.find(query).sort({ created_at: -1 }).limit(limit).toArray()
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          order_status: newStatus,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          payment_status: paymentStatus,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Set actual delivery time
  async setDeliveryTime(orderId) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          actual_delivery_time: new Date(),
          order_status: "delivered",
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Get order statistics for a restaurant
  async getRestaurantOrderStats(restaurantId, startDate, endDate) {
    const pipeline = [
      {
        $match: {
          restaurant_id: new ObjectId(restaurantId),
          created_at: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total_amount" },
          averageOrderValue: { $avg: "$total_amount" },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ["$order_status", "delivered"] }, 1, 0],
            },
          },
        },
      },
    ]

    const result = await this.collection.aggregate(pipeline).toArray()
    return (
      result[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        completedOrders: 0,
      }
    )
  }

  // Get popular items for a restaurant
  async getPopularItems(restaurantId, limit = 10) {
    const pipeline = [
      {
        $match: {
          restaurant_id: new ObjectId(restaurantId),
          order_status: "delivered",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item_id",
          itemName: { $first: "$items.name" },
          totalOrdered: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: limit },
    ]

    return await this.collection.aggregate(pipeline).toArray()
  }

  // Cancel order
  async cancelOrder(orderId, reason = "") {
    const result = await this.collection.updateOne(
      {
        _id: new ObjectId(orderId),
        order_status: { $in: ["pending", "confirmed"] },
      },
      {
        $set: {
          order_status: "cancelled",
          cancellation_reason: reason,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }
}

module.exports = OrderQueries
