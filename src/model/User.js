import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "minimum length should be 3"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email id is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [3, "minimum length should be 6"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
