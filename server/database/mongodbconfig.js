const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.mongoURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
        return client.db("iotHub"); 
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1); // Exit the process if connection fails
    }
}

module.exports = { connectDB, client };
