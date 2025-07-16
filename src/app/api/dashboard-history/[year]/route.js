import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { MonthHistory } from "@/model/MonthHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { year } = await params;
    const yearData = Number(year);

    const user = await getUserFromCookie();
    const userId = new mongoose.Types.ObjectId(String(user.id));
    // console.log(user.id, month, year);

    if (!year) {
      return NextResponse.json({
        message: "Year and month both filed is required ",
      });
    }

    const monthHistoryData = await MonthHistory.aggregate([
      {
        $match: {
          userId,
          year: yearData,
        },
      },
      {
        $group: {
          _id: "$month",
          expense: { $sum: "$expense" },
          income: { $sum: "$income" },
        },
      },
      {
        $project: {
          month: "$_id",
          expense: 1,
          income: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    return NextResponse.json({ monthHistoryData });
  } catch (error) {
    console.log(error, "error from dashboard history route");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
