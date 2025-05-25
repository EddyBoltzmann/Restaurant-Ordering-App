// Restaurant Model Schema Definition
const restaurantSchema = {
  _id: "ObjectId",
  name: "String", // Required
  address: {
    street: "String",
    city: "String",
    state: "String",
    zip_code: "String",
    country: "String",
    coordinates: {
      latitude: "Number",
      longitude: "Number",
    },
  },
  contact_number: "String",
  email: "String",
  operating_hours: {
    monday: { open: "String", close: "String" },
    tuesday: { open: "String", close: "String" },
    wednesday: { open: "String", close: "String" },
    thursday: { open: "String", close: "String" },
    friday: { open: "String", close: "String" },
    saturday: { open: "String", close: "String" },
    sunday: { open: "String", close: "String" },
  },
  description: "String",
  cuisine_type: ["String"], // e.g., ["Italian", "Pizza"]
  price_range: "String", // e.g., "$", "$$", "$$$", "$$$$"
  rating: {
    average: "Number", // 0-5
    total_reviews: "Number",
  },
  images: ["String"], // URLs to restaurant images
  loyalty_program_id: "ObjectId", // Reference to LoyaltyPrograms
  delivery_fee: "Number",
  minimum_order: "Number",
  estimated_delivery_time: "Number", // in minutes
  is_active: "Boolean",
  created_at: "Date",
}

// Example Restaurant document
const exampleRestaurant = {
  _id: new require("mongodb").ObjectId(),
  name: "Pizza Palace",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "USA",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  },
  contact_number: "+1234567892",
  email: "info@pizzapalace.com",
  operating_hours: {
    monday: { open: "09:00", close: "22:00" },
    tuesday: { open: "09:00", close: "22:00" },
    wednesday: { open: "09:00", close: "22:00" },
    thursday: { open: "09:00", close: "22:00" },
    friday: { open: "09:00", close: "23:00" },
    saturday: { open: "10:00", close: "23:00" },
    sunday: { open: "10:00", close: "21:00" },
  },
  description: "Authentic Italian pizza with fresh ingredients",
  cuisine_type: ["Italian", "Pizza"],
  price_range: "$$",
  rating: {
    average: 4.5,
    total_reviews: 127,
  },
  images: ["https://example.com/restaurant1.jpg", "https://example.com/restaurant2.jpg"],
  loyalty_program_id: null,
  delivery_fee: 3.99,
  minimum_order: 15.0,
  estimated_delivery_time: 30,
  is_active: true,
  created_at: new Date(),
}

module.exports = { restaurantSchema, exampleRestaurant }
