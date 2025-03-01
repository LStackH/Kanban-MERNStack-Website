import mongoose, { Connection } from "mongoose";

// Establises connection with the MONGODB_URI, acquired from the .env file. Otherwise uses fallback database
const connectDB = async () => {
  try {
    const mongoDB: string =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fallback"; // Use env variable or fallback
    await mongoose.connect(mongoDB);
    mongoose.Promise = Promise;

    const db: Connection = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error"));
    console.log(`MongoDB Connected: ${db.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
