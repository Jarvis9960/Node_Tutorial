import mongoose from "mongoose";

const connectDb = () => {
  try {
    return mongoose.connect("mongodb://localhost:27017/Jyoti");
  } catch (error) {
    throw new Error("Problem connecting to database", error);
  }
};

export default connectDb;
