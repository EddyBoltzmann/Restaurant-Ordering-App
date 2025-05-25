// MenuItem Model Schema Definition
const menuItemSchema = {
  _id: "ObjectId",
  restaurant_id: "ObjectId", // Reference to Restaurants
  name: "String", // Required
  description: "String",
  price: "Number", // Required
  stock_quantity: "Number", // Default: 0
  is_available: "Boolean", // Default: true
  category: "String", // e.g., "appetizer", "main", "dessert"
  subcategory: "String", // e.g., "pizza", "pasta"
  images: ["String"], // URLs to item images
  nutritional_info: {
    calories: "Number",
    protein: "Number", // in grams
    carbs: "Number", // in grams
    fat: "Number", // in grams
    fiber: "Number", // in grams
    sodium: "Number", // in mg
  },
  allergens: ["String"], // e.g., ["nuts", "dairy", "gluten"]
  preparation_time: "Number", // in minutes
  spice_level: "Number", // 0-5 scale
  is_featured: "Boolean", // Default: false
  discount: {
    percentage: "Number", // 0-100
    valid_until: "Date",
  },
  created_at: "Date",
  updated_at: "Date",
}

// Example MenuItem document
const exampleMenuItem = {
  _id: new require("mongodb").ObjectId(),
  restaurant_id: new require("mongodb").ObjectId(),
  name: "Margherita Pizza",
  description: "Classic pizza with tomato sauce, mozzarella, and basil",
  price: 12.99,
  stock_quantity: 50,
  is_available: true,
  category: "main",
  subcategory: "pizza",
  images: ["https://example.com/margherita1.jpg", "https://example.com/margherita2.jpg"],
  nutritional_info: {
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
    fiber: 2,
    sodium: 640,
  },
  allergens: ["gluten", "dairy"],
  preparation_time: 15,
  spice_level: 0,
  is_featured: false,
  discount: {
    percentage: 0,
    valid_until: null,
  },
  created_at: new Date(),
  updated_at: new Date(),
}

module.exports = { menuItemSchema, exampleMenuItem }
