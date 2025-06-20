import mongoose from "mongoose";

const yearHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
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

export const YearHistory =
  mongoose.models.YearHistory ||
  mongoose.model("YearHistory", yearHistorySchema);
