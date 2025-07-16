import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category Name is required"],
    },
    transactionDate: {
      type: Date,
      required: [true, "Date is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    transactionType: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "TransactionType is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
