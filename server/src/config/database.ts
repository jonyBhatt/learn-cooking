import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lc"
    );
    console.log(`Your database connected to ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Exit process with failure
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
