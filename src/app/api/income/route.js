import { connectDB } from "@/db/connectDB";
import { Income } from "@/model/Income";
import { MonthHistory } from "@/model/MonthHistory";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const incomeList = await Income.find({});

    return NextResponse.json({ success: true, incomeList }, { status: 200 });
  } catch (error) {
    console.log("error is from Income GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const { userId, amount, description, categoryId, date } =
      await request.json();

    if (!userId || !amount || !description || !categoryId || !date) {
      return NextResponse.json(
        { success: false, Message: "All field is required" },
        { status: 400 }
      );
    }

    // Validating mongo DB ID :
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      return NextResponse.json(
        { success: false, Message: "Invalid  ID" },
        { status: 400 }
      );
    }

    // Creating new Expense :
    const newIncome = new Income({
      userId,
      amount,
      description,
      categoryId,
      date,
    });

    await newIncome.save();

    // here we need to update the MonthHistory and YearHistory :
    const incomeDate = new Date(date);
    const day = incomeDate.getDate();
    const month = incomeDate.getMonth() + 1;
    const year = incomeDate.getFullYear();

    // Update month history
    await MonthHistory.findOneAndUpdate(
      { userId, date: day, month, year },
      { $inc: { income: amount } },
      { upsert: true, new: true }
    );

    // Update year history
    await YearHistory.findOneAndUpdate(
      { userId, year },
      { $inc: { income: amount } },
      { upsert: true, new: true }
    );
    return NextResponse.json(
      {
        success: true,
        message: "New Income Created Successfully",
        Income: newIncome,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error is from Income post fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
