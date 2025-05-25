const { MongoClient } = require("mongodb")

let db = null
let client = null

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
    const dbName = process.env.DB_NAME || "foodconnect"

    client = new MongoClient(uri, {
      useUnifiedTopology: true,
    })

    await client.connect()
    db = client.db(dbName)

    console.log(`Connected to MongoDB: ${dbName}`)

    // Create indexes if they don't exist
    await createIndexes()

    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

const createIndexes = async () => {
  try {
    // Users indexes
    await db
      .collection("users")
      .createIndexes([{ key: { email: 1 }, unique: true }, { key: { phone_number: 1 } }, { key: { created_at: -1 } }])

    // Restaurants indexes
    await db
      .collection("restaurants")
      .createIndexes([
        { key: { name: 1 } },
        { key: { "address.city": 1 } },
        { key: { "address.coordinates": "2dsphere" } },
        { key: { cuisine_type: 1 } },
        { key: { is_active: 1 } },
      ])

    // Menu items indexes
    await db
      .collection("menuItems")
      .createIndexes([
        { key: { restaurant_id: 1 } },
        { key: { name: 1 } },
        { key: { category: 1 } },
        { key: { is_available: 1 } },
        { key: { restaurant_id: 1, is_available: 1 } },
      ])

    // Orders indexes
    await db
      .collection("orders")
      .createIndexes([
        { key: { user_id: 1 } },
        { key: { restaurant_id: 1 } },
        { key: { order_status: 1 } },
        { key: { created_at: -1 } },
        { key: { user_id: 1, created_at: -1 } },
      ])

    console.log("Database indexes created successfully")
  } catch (error) {
    console.error("Error creating indexes:", error)
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected")
  }
  return db
}

const closeDB = async () => {
  if (client) {
    await client.close()
    console.log("Database connection closed")
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
}
