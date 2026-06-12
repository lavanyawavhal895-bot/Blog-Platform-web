import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    console.error(
      "❌ Database Connection Error: MONGODB_URI is not defined in your environment variables.\n" +
      "Please check that your .env file contains MONGODB_URI and that dotenv.config() is initialized at the absolute top of your application entry point."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("🍃 MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;