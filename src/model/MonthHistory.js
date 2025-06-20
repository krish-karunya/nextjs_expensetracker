import mongoose from "mongoose";

const monthHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserID is required"],
    },
    date: {
      type: Number,
      required: [true, "date is required"],
    },
    month: {
      type: Number,
      required: [true, "date is required"],
    },
    year: {
      type: Number,
      required: [true, "date is required"],
    },
    income: {
      type: Number,
      default: 0,
    },
    expense: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const MonthHistory =
  mongoose.models.MonthHistory ||
  mongoose.model("MonthHistory", monthHistorySchema);
