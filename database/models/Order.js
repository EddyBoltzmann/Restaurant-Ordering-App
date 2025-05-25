// Order Model Schema Definition
const orderSchema = {
  _id: "ObjectId",
  user_id: "ObjectId", // Reference to Users
  restaurant_id: "ObjectId", // Reference to Restaurants
  order_type: "String", // "app", "phone", "qr_code", "web"
  order_status: "String", // "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"
  items: [
    {
      item_id: "ObjectId", // Reference to MenuItems
      name: "String", // Snapshot of item name
      price: "Number", // Snapshot of item price
      quantity: "Number",
      special_instructions: "String",
    },
  ],
  subtotal: "Number",
  tax_amount: "Number",
  delivery_fee: "Number",
  discount_amount: "Number",
  total_amount: "Number",
  delivery_address: {
    street: "String",
    city: "String",
    state: "String",
    zip_code: "String",
    country: "String",
    delivery_instructions: "String",
  },
  estimated_delivery_time: "Date",
  actual_delivery_time: "Date",
  payment_status: "String", // "pending", "paid", "failed", "refunded"
  loyalty_points_earned: "Number",
  loyalty_points_used: "Number",
  created_at: "Date",
  updated_at: "Date",
  notes: "String", // Internal notes for restaurant
}

// Example Order document
const exampleOrder = {
  _id: new require("mongodb").ObjectId(),
  user_id: new require("mongodb").ObjectId(),
  restaurant_id: new require("mongodb").ObjectId(),
  order_type: "app",
  order_status: "confirmed",
  items: [
    {
      item_id: new require("mongodb").ObjectId(),
      name: "Margherita Pizza",
      price: 12.99,
      quantity: 2,
      special_instructions: "Extra cheese please",
    },
    {
      item_id: new require("mongodb").ObjectId(),
      name: "Garlic Bread",
      price: 4.99,
      quantity: 1,
      special_instructions: "",
    },
  ],
  subtotal: 30.97,
  tax_amount: 2.48,
  delivery_fee: 3.99,
  discount_amount: 0,
  total_amount: 37.44,
  delivery_address: {
    street: "456 Oak Ave",
    city: "New York",
    state: "NY",
    zip_code: "10002",
    country: "USA",
    delivery_instructions: "Ring doorbell twice",
  },
  estimated_delivery_time: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
  actual_delivery_time: null,
  payment_status: "paid",
  loyalty_points_earned: 37,
  loyalty_points_used: 0,
  created_at: new Date(),
  updated_at: new Date(),
  notes: "",
}

module.exports = { orderSchema, exampleOrder }
