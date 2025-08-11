import mongoose from "mongoose";

export const ConnetMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("mongo connected!!!!");
  } catch (error) {
    console.log(error);
  }
};
