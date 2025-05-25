// Restaurant-related database queries
const { ObjectId } = require("mongodb")

class RestaurantQueries {
  constructor(db) {
    this.db = db
    this.collection = db.collection("restaurants")
  }

  // Get all active restaurants
  async getAllRestaurants(filters = {}) {
    const query = { is_active: true }

    // Add city filter if provided
    if (filters.city) {
      query["address.city"] = new RegExp(filters.city, "i")
    }

    // Add cuisine type filter if provided
    if (filters.cuisine_type) {
      query.cuisine_type = { $in: [filters.cuisine_type] }
    }

    // Add price range filter if provided
    if (filters.price_range) {
      query.price_range = filters.price_range
    }

    const restaurants = await this.collection.find(query).sort({ "rating.average": -1 }).toArray()

    return restaurants
  }

  // Get restaurant by ID
  async getRestaurantById(restaurantId) {
    return await this.collection.findOne({
      _id: new ObjectId(restaurantId),
      is_active: true,
    })
  }

  // Search restaurants by name or cuisine
  async searchRestaurants(searchTerm, city = null) {
    const query = {
      is_active: true,
      $or: [
        { name: new RegExp(searchTerm, "i") },
        { description: new RegExp(searchTerm, "i") },
        { cuisine_type: { $in: [new RegExp(searchTerm, "i")] } },
      ],
    }

    if (city) {
      query["address.city"] = new RegExp(city, "i")
    }

    return await this.collection.find(query).sort({ "rating.average": -1 }).toArray()
  }

  // Get restaurants near coordinates
  async getRestaurantsNearby(latitude, longitude, maxDistance = 5000) {
    return await this.collection
      .find({
        is_active: true,
        "address.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      })
      .toArray()
  }

  // Update restaurant rating
  async updateRating(restaurantId, newRating, totalReviews) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(restaurantId) },
      {
        $set: {
          "rating.average": newRating,
          "rating.total_reviews": totalReviews,
          updated_at: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }

  // Get restaurant menu
  async getRestaurantMenu(restaurantId) {
    const menuItems = await this.db
      .collection("menuItems")
      .find({
        restaurant_id: new ObjectId(restaurantId),
        is_available: true,
      })
      .sort({ category: 1, name: 1 })
      .toArray()

    // Group by category
    const groupedMenu = {}
    menuItems.forEach((item) => {
      if (!groupedMenu[item.category]) {
        groupedMenu[item.category] = []
      }
      groupedMenu[item.category].push(item)
    })

    return groupedMenu
  }

  // Get restaurant operating hours for today
  async getOperatingHours(restaurantId) {
    const restaurant = await this.getRestaurantById(restaurantId)
    if (!restaurant) return null

    const today = new Date().toLocaleLowerCase().slice(0, 3) // 'mon', 'tue', etc.
    const dayMap = {
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday",
    }

    const dayName = dayMap[today] || "monday"
    return restaurant.operating_hours[dayName]
  }

  // Check if restaurant is currently open
  async isRestaurantOpen(restaurantId) {
    const hours = await this.getOperatingHours(restaurantId)
    if (!hours) return false

    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")

    return currentTime >= hours.open && currentTime <= hours.close
  }
}

module.exports = RestaurantQueries
