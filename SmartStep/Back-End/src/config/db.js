import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURL = process.env.MONGODB_URL;

  if (!mongoURL) {
    throw new Error("MONGODB_URL is missing from environment variables.");
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
