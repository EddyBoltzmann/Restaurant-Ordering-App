// User Model Schema Definition
const userSchema = {
  _id: "ObjectId", // MongoDB auto-generated
  name: "String", // Required
  email: "String", // Required, unique, indexed
  password_hash: "String", // Required, bcrypt hashed
  phone_number: "String", // Optional, for phone orders
  created_at: "Date", // Default: new Date()
  is_verified: "Boolean", // Default: false
  profile_image: "String", // Optional, URL to image
  address: {
    street: "String",
    city: "String",
    state: "String",
    zip_code: "String",
    country: "String",
  },
  preferences: {
    dietary_restrictions: ["ObjectId"], // References to DietaryTags
    favorite_restaurants: ["ObjectId"], // References to Restaurants
    notification_settings: {
      email_notifications: "Boolean",
      sms_notifications: "Boolean",
      push_notifications: "Boolean",
    },
  },
  last_login: "Date",
  is_active: "Boolean", // Default: true
}

// Example User document
const exampleUser = {
  _id: new require("mongodb").ObjectId(),
  name: "John Doe",
  email: "john@example.com",
  password_hash: "$2b$10$example_hash_here",
  phone_number: "+1234567890",
  created_at: new Date(),
  is_verified: true,
  profile_image: "https://example.com/profile.jpg",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "USA",
  },
  preferences: {
    dietary_restrictions: [],
    favorite_restaurants: [],
    notification_settings: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
    },
  },
  last_login: new Date(),
  is_active: true,
}

module.exports = { userSchema, exampleUser }
