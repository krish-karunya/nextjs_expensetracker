import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID is required"],
    },
    categoryType: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Category type is required"],
    },

    emoji: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
