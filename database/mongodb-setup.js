// MongoDB Database Setup for FoodConnect Restaurant Ordering App
const { MongoClient } = require("mongodb")

// Connection URL - replace with your MongoDB connection string
const url = "mongodb://localhost:27017"
const dbName = "foodconnect"

async function setupDatabase() {
  const client = new MongoClient(url)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Create collections and indexes
    await createCollections(db)
    await createIndexes(db)
    await insertSampleData(db)

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    await client.close()
  }
}

async function createCollections(db) {
  const collections = [
    "users",
    "restaurants",
    "menuItems",
    "dietaryTags",
    "menuDietaryTags",
    "orders",
    "orderItems",
    "loyaltyPrograms",
    "messages",
    "staff",
    "payments",
    "charities",
    "donations",
    "qrCodes",
  ]

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName)
      console.log(`Created collection: ${collectionName}`)
    } catch (error) {
      if (error.code === 48) {
        console.log(`Collection ${collectionName} already exists`)
      } else {
        throw error
      }
    }
  }
}

async function createIndexes(db) {
  // Users collection indexes
  await db
    .collection("users")
    .createIndexes([{ key: { email: 1 }, unique: true }, { key: { phone_number: 1 } }, { key: { created_at: -1 } }])

  // Restaurants collection indexes
  await db
    .collection("restaurants")
    .createIndexes([{ key: { name: 1 } }, { key: { "address.city": 1 } }, { key: { loyalty_program_id: 1 } }])

  // MenuItems collection indexes
  await db
    .collection("menuItems")
    .createIndexes([
      { key: { restaurant_id: 1 } },
      { key: { name: 1 } },
      { key: { price: 1 } },
      { key: { is_available: 1 } },
      { key: { restaurant_id: 1, is_available: 1 } },
    ])

  // DietaryTags collection indexes
  await db.collection("dietaryTags").createIndexes([{ key: { name: 1 }, unique: true }])

  // MenuDietaryTags collection indexes
  await db
    .collection("menuDietaryTags")
    .createIndexes([{ key: { item_id: 1 } }, { key: { tag_id: 1 } }, { key: { item_id: 1, tag_id: 1 }, unique: true }])

  // Orders collection indexes
  await db
    .collection("orders")
    .createIndexes([
      { key: { user_id: 1 } },
      { key: { restaurant_id: 1 } },
      { key: { order_status: 1 } },
      { key: { created_at: -1 } },
      { key: { user_id: 1, created_at: -1 } },
    ])

  // OrderItems collection indexes
  await db.collection("orderItems").createIndexes([{ key: { order_id: 1 } }, { key: { item_id: 1 } }])

  // LoyaltyPrograms collection indexes
  await db
    .collection("loyaltyPrograms")
    .createIndexes([{ key: { restaurant_id: 1, user_id: 1 }, unique: true }, { key: { user_id: 1 } }])

  // Messages collection indexes
  await db
    .collection("messages")
    .createIndexes([
      { key: { sender_id: 1 } },
      { key: { receiver_id: 1 } },
      { key: { timestamp: -1 } },
      { key: { is_read: 1 } },
    ])

  // Staff collection indexes
  await db.collection("staff").createIndexes([{ key: { restaurant_id: 1 } }, { key: { role: 1 } }])

  // Payments collection indexes
  await db
    .collection("payments")
    .createIndexes([
      { key: { order_id: 1 } },
      { key: { status: 1 } },
      { key: { payment_method: 1 } },
      { key: { approved_by: 1 } },
    ])

  // Charities collection indexes
  await db.collection("charities").createIndexes([{ key: { name: 1 } }])

  // Donations collection indexes
  await db
    .collection("donations")
    .createIndexes([{ key: { user_id: 1 } }, { key: { charity_id: 1 } }, { key: { timestamp: -1 } }])

  // QRCodes collection indexes
  await db
    .collection("qrCodes")
    .createIndexes([
      { key: { restaurant_id: 1 } },
      { key: { code_hash: 1 }, unique: true },
      { key: { expiry_time: 1 } },
    ])

  console.log("All indexes created successfully")
}

async function insertSampleData(db) {
  // Sample Users
  const users = [
    {
      _id: new require("mongodb").ObjectId(),
      name: "John Doe",
      email: "john@example.com",
      password_hash: "$2b$10$example_hash_here",
      phone_number: "+1234567890",
      created_at: new Date(),
      is_verified: true,
    },
    {
      _id: new require("mongodb").ObjectId(),
      name: "Jane Smith",
      email: "jane@example.com",
      password_hash: "$2b$10$example_hash_here",
      phone_number: "+1234567891",
      created_at: new Date(),
      is_verified: true,
    },
  ]

  await db.collection("users").insertMany(users)
  console.log("Sample users inserted")

  // Sample Restaurants
  const restaurants = [
    {
      _id: new require("mongodb").ObjectId(),
      name: "Pizza Palace",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        country: "USA",
      },
      contact_number: "+1234567892",
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
      loyalty_program_id: null,
      created_at: new Date(),
      is_active: true,
    },
    {
      _id: new require("mongodb").ObjectId(),
      name: "Burger King",
      address: {
        street: "456 Oak Ave",
        city: "New York",
        state: "NY",
        zip_code: "10002",
        country: "USA",
      },
      contact_number: "+1234567893",
      operating_hours: {
        monday: { open: "08:00", close: "23:00" },
        tuesday: { open: "08:00", close: "23:00" },
        wednesday: { open: "08:00", close: "23:00" },
        thursday: { open: "08:00", close: "23:00" },
        friday: { open: "08:00", close: "24:00" },
        saturday: { open: "08:00", close: "24:00" },
        sunday: { open: "09:00", close: "22:00" },
      },
      description: "Home of the Whopper and flame-grilled burgers",
      loyalty_program_id: null,
      created_at: new Date(),
      is_active: true,
    },
  ]

  await db.collection("restaurants").insertMany(restaurants)
  console.log("Sample restaurants inserted")

  // Sample Dietary Tags
  const dietaryTags = [
    {
      _id: new require("mongodb").ObjectId(),
      name: "vegan",
      description: "Contains no animal products",
    },
    {
      _id: new require("mongodb").ObjectId(),
      name: "gluten-free",
      description: "Contains no gluten",
    },
    {
      _id: new require("mongodb").ObjectId(),
      name: "vegetarian",
      description: "Contains no meat",
    },
    {
      _id: new require("mongodb").ObjectId(),
      name: "dairy-free",
      description: "Contains no dairy products",
    },
  ]

  await db.collection("dietaryTags").insertMany(dietaryTags)
  console.log("Sample dietary tags inserted")

  // Sample Menu Items
  const menuItems = [
    {
      _id: new require("mongodb").ObjectId(),
      restaurant_id: restaurants[0]._id,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      stock_quantity: 50,
      is_available: true,
      category: "pizza",
      preparation_time: 15,
      created_at: new Date(),
    },
    {
      _id: new require("mongodb").ObjectId(),
      restaurant_id: restaurants[0]._id,
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      stock_quantity: 30,
      is_available: true,
      category: "pizza",
      preparation_time: 15,
      created_at: new Date(),
    },
    {
      _id: new require("mongodb").ObjectId(),
      restaurant_id: restaurants[1]._id,
      name: "Whopper",
      description: "Flame-grilled beef patty with tomatoes, lettuce, onions",
      price: 6.99,
      stock_quantity: 100,
      is_available: true,
      category: "burger",
      preparation_time: 8,
      created_at: new Date(),
    },
  ]

  await db.collection("menuItems").insertMany(menuItems)
  console.log("Sample menu items inserted")

  // Sample Staff
  const staff = [
    {
      _id: new require("mongodb").ObjectId(),
      restaurant_id: restaurants[0]._id,
      name: "Mario Rossi",
      role: "chef",
      email: "mario@pizzapalace.com",
      phone_number: "+1234567894",
      hire_date: new Date(),
      is_active: true,
    },
    {
      _id: new require("mongodb").ObjectId(),
      restaurant_id: restaurants[0]._id,
      name: "Luigi Verde",
      role: "admin",
      email: "luigi@pizzapalace.com",
      phone_number: "+1234567895",
      hire_date: new Date(),
      is_active: true,
    },
  ]

  await db.collection("staff").insertMany(staff)
  console.log("Sample staff inserted")

  // Sample Charities
  const charities = [
    {
      _id: new require("mongodb").ObjectId(),
      name: "Local Food Bank",
      description: "Providing meals to families in need",
      contact_info: {
        email: "info@localfoodbank.org",
        phone: "+1234567896",
        website: "www.localfoodbank.org",
      },
      created_at: new Date(),
      is_active: true,
    },
  ]

  await db.collection("charities").insertMany(charities)
  console.log("Sample charities inserted")
}

// Run the setup
setupDatabase().catch(console.error)
