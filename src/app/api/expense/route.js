import { connectDB } from "@/db/connectDB";
import { Expense } from "@/model/Expense";
import { MonthHistory } from "@/model/MonthHistory";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    expenseList = await Expense.find({});

    return NextResponse.json({ success: true, expenseList });
  } catch (error) {
    console.log("error is from Expense GET fn");
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
    const newExpense = new Expense({
      userId,
      amount,
      description,
      categoryId,
      date,
    });

    await newExpense.save();

    // Once expense is created the update the monthHistory and Year History :

    const expenseDate = new Date(date);

    let dates = expenseDate.getDate();
    let month = expenseDate.getMonth() + 1;
    let year = expenseDate.getFullYear();

    console.log("date -", dates, "month -", month, "year -", year);

    // If the Document exist it will update ,Otherwise it will create a new Document with the help of  whatever field i have passed in the  filter and update field,If I haven't pass the income field so it will created with default value

    await MonthHistory.findOneAndUpdate(
      { year, month, date: dates, userId },
      { $inc: { expense: amount } },
      { upsert: true, new: true }
    );
    // Year History need to Update here :
    await YearHistory.findOneAndUpdate(
      { userId, year },
      { $inc: { expense: amount } },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "New Expense Created Successfully",
        expense: newExpense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error is from Expense post fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
