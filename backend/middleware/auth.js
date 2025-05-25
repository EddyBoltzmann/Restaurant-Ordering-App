const jwt = require("jsonwebtoken")
const { getDB } = require("../config/database")
const { ObjectId } = require("mongodb")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")

    // Get user from database
    const db = getDB()
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password_hash: 0 } })

    if (!user) {
      return res.status(401).json({ error: "Invalid token." })
    }

    if (!user.is_active) {
      return res.status(401).json({ error: "Account is deactivated." })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." })
    }
    res.status(500).json({ error: "Server error during authentication." })
  }
}

// Middleware for admin/staff only
const adminMiddleware = async (req, res, next) => {
  try {
    const db = getDB()
    const staff = await db.collection("staff").findOne({
      user_id: req.user._id,
      is_active: true,
    })

    if (!staff || !["admin", "manager"].includes(staff.role)) {
      return res.status(403).json({ error: "Access denied. Admin privileges required." })
    }

    req.staff = staff
    next()
  } catch (error) {
    res.status(500).json({ error: "Server error during authorization." })
  }
}

// Middleware for restaurant staff
const restaurantStaffMiddleware = (req, res, next) => {
  const restaurantId = req.params.restaurantId || req.body.restaurant_id

  if (req.staff && req.staff.restaurant_id.toString() === restaurantId) {
    next()
  } else {
    res.status(403).json({ error: "Access denied. Not authorized for this restaurant." })
  }
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  restaurantStaffMiddleware,
}
