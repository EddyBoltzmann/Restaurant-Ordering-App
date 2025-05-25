const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getDB } = require("../config/database")
const { ObjectId } = require("mongodb")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// Register new user
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone_number").optional().isMobilePhone().withMessage("Valid phone number required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, phone_number } = req.body
      const db = getDB()

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" })
      }

      // Hash password
      const saltRounds = 12
      const password_hash = await bcrypt.hash(password, saltRounds)

      // Create user
      const newUser = {
        name,
        email,
        password_hash,
        phone_number: phone_number || null,
        created_at: new Date(),
        is_verified: false,
        is_active: true,
        preferences: {
          dietary_restrictions: [],
          favorite_restaurants: [],
          notification_settings: {
            email_notifications: true,
            sms_notifications: false,
            push_notifications: true,
          },
        },
      }

      const result = await db.collection("users").insertOne(newUser)

      // Generate JWT token
      const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: "7d",
      })

      // Remove password from response
      delete newUser.password_hash
      newUser._id = result.insertedId

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: newUser,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "Server error during registration" })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body
      const db = getDB()

      // Find user
      const user = await db.collection("users").findOne({ email })
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      if (!user.is_active) {
        return res.status(401).json({ error: "Account is deactivated" })
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Update last login
      await db.collection("users").updateOne({ _id: user._id }, { $set: { last_login: new Date() } })

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

      // Remove password from response
      delete user.password_hash

      res.json({
        message: "Login successful",
        token,
        user,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Server error during login" })
    }
  },
)

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    const db = getDB()

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(decoded.userId) }, { $set: { is_verified: true } })

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Invalid or expired verification token" })
    }

    res.json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired verification token" })
  }
})

// Forgot password
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const { email } = req.body
      const db = getDB()

      const user = await db.collection("users").findOne({ email })
      if (!user) {
        // Don't reveal if email exists or not
        return res.json({ message: "If the email exists, a reset link has been sent" })
      }

      // Generate reset token (in production, send via email)
      const resetToken = jwt.sign(
        { userId: user._id, type: "password-reset" },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "1h" },
      )

      // In production, send this token via email
      console.log("Password reset token:", resetToken)

      res.json({
        message: "If the email exists, a reset link has been sent",
        // Remove this in production
        resetToken,
      })
    } catch (error) {
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Reset password
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const { token, password } = req.body

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")

      if (decoded.type !== "password-reset") {
        return res.status(400).json({ error: "Invalid reset token" })
      }

      const db = getDB()
      const saltRounds = 12
      const password_hash = await bcrypt.hash(password, saltRounds)

      const result = await db
        .collection("users")
        .updateOne({ _id: new ObjectId(decoded.userId) }, { $set: { password_hash } })

      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: "Invalid reset token" })
      }

      res.json({ message: "Password reset successfully" })
    } catch (error) {
      res.status(400).json({ error: "Invalid or expired reset token" })
    }
  },
)

module.exports = router
