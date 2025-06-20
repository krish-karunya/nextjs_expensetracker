import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "description required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    description: {
      type: String,
      required: [true, "description required"],
    },
  },
  { timestamps: true }
);

export const Income =
  mongoose.models.Income || mongoose.model("Income", incomeSchema);
