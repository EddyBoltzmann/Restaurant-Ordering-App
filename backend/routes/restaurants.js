const express = require("express")
const { getDB } = require("../config/database")
const { ObjectId } = require("mongodb")
const { query, param } = require("express-validator")

const router = express.Router()

// Get all restaurants with filters
router.get(
  "/",
  [
    query("city").optional().trim(),
    query("cuisine_type").optional().trim(),
    query("price_range").optional().isIn(["$", "$$", "$$$", "$$$$"]),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  async (req, res) => {
    try {
      const { city, cuisine_type, price_range, page = 1, limit = 20 } = req.query
      const db = getDB()

      const query_filter = { is_active: true }

      if (city) {
        query_filter["address.city"] = new RegExp(city, "i")
      }

      if (cuisine_type) {
        query_filter.cuisine_type = { $in: [new RegExp(cuisine_type, "i")] }
      }

      if (price_range) {
        query_filter.price_range = price_range
      }

      const skip = (page - 1) * limit

      const restaurants = await db
        .collection("restaurants")
        .find(query_filter)
        .sort({ "rating.average": -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await db.collection("restaurants").countDocuments(query_filter)

      res.json({
        restaurants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Search restaurants
router.get(
  "/search",
  [
    query("q").notEmpty().trim().withMessage("Search query is required"),
    query("city").optional().trim(),
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  async (req, res) => {
    try {
      const { q, city, page = 1, limit = 20 } = req.query
      const db = getDB()

      const query_filter = {
        is_active: true,
        $or: [
          { name: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
          { cuisine_type: { $in: [new RegExp(q, "i")] } },
        ],
      }

      if (city) {
        query_filter["address.city"] = new RegExp(city, "i")
      }

      const skip = (page - 1) * limit

      const restaurants = await db
        .collection("restaurants")
        .find(query_filter)
        .sort({ "rating.average": -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await db.collection("restaurants").countDocuments(query_filter)

      res.json({
        restaurants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Error searching restaurants:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Get restaurants nearby
router.get(
  "/nearby",
  [
    query("lat").isFloat().withMessage("Valid latitude is required"),
    query("lng").isFloat().withMessage("Valid longitude is required"),
    query("maxDistance").optional().isInt({ min: 100, max: 50000 }).toInt(),
  ],
  async (req, res) => {
    try {
      const { lat, lng, maxDistance = 5000 } = req.query
      const db = getDB()

      const restaurants = await db
        .collection("restaurants")
        .find({
          is_active: true,
          "address.coordinates": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
              },
              $maxDistance: Number.parseInt(maxDistance),
            },
          },
        })
        .limit(20)
        .toArray()

      res.json({ restaurants })
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Get restaurant by ID
router.get("/:id", [param("id").isMongoId().withMessage("Valid restaurant ID is required")], async (req, res) => {
  try {
    const { id } = req.params
    const db = getDB()

    const restaurant = await db.collection("restaurants").findOne({
      _id: new ObjectId(id),
      is_active: true,
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    res.json({ restaurant })
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get restaurant menu
router.get("/:id/menu", [param("id").isMongoId().withMessage("Valid restaurant ID is required")], async (req, res) => {
  try {
    const { id } = req.params
    const db = getDB()

    // First check if restaurant exists
    const restaurant = await db.collection("restaurants").findOne({
      _id: new ObjectId(id),
      is_active: true,
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    // Get menu items
    const menuItems = await db
      .collection("menuItems")
      .find({
        restaurant_id: new ObjectId(id),
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

    res.json({
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
      },
      menu: groupedMenu,
    })
  } catch (error) {
    console.error("Error fetching restaurant menu:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Check if restaurant is open
router.get(
  "/:id/status",
  [param("id").isMongoId().withMessage("Valid restaurant ID is required")],
  async (req, res) => {
    try {
      const { id } = req.params
      const db = getDB()

      const restaurant = await db.collection("restaurants").findOne({
        _id: new ObjectId(id),
        is_active: true,
      })

      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" })
      }

      // Get current day and time
      const now = new Date()
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const currentDay = days[now.getDay()]
      const currentTime =
        now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")

      const todayHours = restaurant.operating_hours[currentDay]
      const isOpen = todayHours && currentTime >= todayHours.open && currentTime <= todayHours.close

      res.json({
        restaurant_id: restaurant._id,
        name: restaurant.name,
        is_open: isOpen,
        current_time: currentTime,
        today_hours: todayHours,
        operating_hours: restaurant.operating_hours,
      })
    } catch (error) {
      console.error("Error checking restaurant status:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

module.exports = router
