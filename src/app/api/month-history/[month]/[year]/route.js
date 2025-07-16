import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { MonthHistory } from "@/model/MonthHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { month, year } = await params;
    const monthData = Number(month);
    const yearData = Number(year);

    const user = await getUserFromCookie();
    const userId = new mongoose.Types.ObjectId(String(user.id));
    console.log(user.id, month, year);

    if (!month || !year) {
      return NextResponse.json({
        message: "Year and month both filed is required ",
      });
    }

    const monthHistoryData = await MonthHistory.aggregate([
      {
        $match: {
          userId,
          month: monthData,
          year: yearData,
        },
      },
      {
        $group: {
          _id: "$userId",
          totalIncome: { $sum: "$income" },
          totalExpense: { $sum: "$expense" },
        },
      },
      {
        $project: {
          totalIncome: 1,
          totalExpense: 1,
          totalBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
    ]);

    return NextResponse.json({ monthHistoryData });
  } catch (error) {
    console.log(error, "error from month history route");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
