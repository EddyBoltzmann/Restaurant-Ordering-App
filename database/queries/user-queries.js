// User-related database queries
const { MongoClient, ObjectId } = require("mongodb")

class UserQueries {
  constructor(db) {
    this.db = db
    this.collection = db.collection("users")
  }

  // Create a new user
  async createUser(userData) {
    try {
      const user = {
        ...userData,
        created_at: new Date(),
        is_verified: false,
        is_active: true,
      }

      const result = await this.collection.insertOne(user)
      return { success: true, userId: result.insertedId }
    } catch (error) {
      if (error.code === 11000) {
        return { success: false, error: "Email already exists" }
      }
      throw error
    }
  }

  // Find user by email
  async findByEmail(email) {
    return await this.collection.findOne({ email: email.toLowerCase() })
  }

  // Find user by ID
  async findById(userId) {
    return await this.collection.findOne({ _id: new ObjectId(userId) })
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updateData,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Verify user email
  async verifyEmail(userId) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          is_verified: true,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Update last login
  async updateLastLogin(userId) {
    await this.collection.updateOne({ _id: new ObjectId(userId) }, { $set: { last_login: new Date() } })
  }

  // Add favorite restaurant
  async addFavoriteRestaurant(userId, restaurantId) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          "preferences.favorite_restaurants": new ObjectId(restaurantId),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Remove favorite restaurant
  async removeFavoriteRestaurant(userId, restaurantId) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: {
          "preferences.favorite_restaurants": new ObjectId(restaurantId),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Get user's favorite restaurants
  async getFavoriteRestaurants(userId) {
    const user = await this.collection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { "preferences.favorite_restaurants": 1 } },
    )

    if (!user || !user.preferences?.favorite_restaurants) {
      return []
    }

    // Get restaurant details
    const restaurants = await this.db
      .collection("restaurants")
      .find({
        _id: { $in: user.preferences.favorite_restaurants },
        is_active: true,
      })
      .toArray()

    return restaurants
  }
}

module.exports = UserQueries
