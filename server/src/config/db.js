import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.includes("cluster0.xxxxx") || uri.includes("localhost:27017") && process.env.USE_IN_MEMORY !== "false") {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log("Using in-memory MongoDB server for development");
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
