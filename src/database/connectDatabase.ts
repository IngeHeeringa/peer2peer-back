import mongoose from "mongoose";
import { userSchema } from "./models/User.js";

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);

  userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  });

  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new Error("Error connecting to database");
  }
};

export default connectDatabase;
