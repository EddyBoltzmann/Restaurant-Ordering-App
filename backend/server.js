const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { MongoClient } = require("mongodb")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const http = require("http")
const socketIo = require("socket.io")
require("dotenv").config()

// Import route handlers
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const restaurantRoutes = require("./routes/restaurants")
const orderRoutes = require("./routes/orders")
const menuRoutes = require("./routes/menu")
const loyaltyRoutes = require("./routes/loyalty")
const paymentRoutes = require("./routes/payments")

// Import middleware
const authMiddleware = require("./middleware/auth")
const errorHandler = require("./middleware/errorHandler")

// Import database connection
const connectDB = require("./config/database")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authMiddleware, userRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/orders", authMiddleware, orderRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/loyalty", authMiddleware, loyaltyRoutes)
app.use("/api/payments", authMiddleware, paymentRoutes)

// Socket.IO for real-time features
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Join room for order updates
  socket.on("join-order-room", (orderId) => {
    socket.join(`order-${orderId}`)
    console.log(`User ${socket.id} joined order room: ${orderId}`)
  })

  // Join room for restaurant updates
  socket.on("join-restaurant-room", (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`)
    console.log(`User ${socket.id} joined restaurant room: ${restaurantId}`)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Make io available to routes
app.set("io", io)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

const PORT = process.env.PORT || 3000

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = { app, io }
