import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { Category } from "@/model/Category";
import { Expense } from "@/model/Expense";
import { MonthHistory } from "@/model/MonthHistory";
import { Transaction } from "@/model/Transaction";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromCookie();
  console.log(user.id);

  try {
    await connectDB();

    const expenseList = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(String(user.id)),
        },
      },
      {
        $lookup: {
          from: "categories", // this represent the collection
          localField: "categoryId", // field name from expense
          foreignField: "_id", // field name category
          as: "categoryDetails", // what name we want for the data
        },
      },
      {
        $unwind: "$categoryDetails", // turns array into single object
      },
      {
        $project: {
          amount: 1,
          description: 1,
          date: 1,
          month: 1,
          year: 1,
          categoryName: "$categoryDetails.name",
          type: "$categoryDetails.categoryType",
        },
      },
      {
        $sort: {
          month: 1,
          year: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, expenseList });
  } catch (error) {
    console.log("error is from Expense GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserFromCookie();
  try {
    await connectDB();

    const { amount, description, categoryId, date } = await request.json();

    // console.log(amount, description, categoryId, date);

    if (!amount || !description || !categoryId || !date) {
      return NextResponse.json(
        { success: false, Message: "All field is required" },
        { status: 400 }
      );
    }

    // Validating mongo DB ID :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, Message: "Invalid  ID" },
        { status: 400 }
      );
    }
    const expenseDate = new Date(date);

    let dates = expenseDate.getDate();
    let month = expenseDate.getMonth() + 1;
    let year = expenseDate.getFullYear();

    // console.log("date -", dates, "month -", month, "year -", year);

    // Creating new Expense :
    const newExpense = new Expense({
      userId: user.id,
      amount,
      description,
      categoryId,
      year,
      month,
      date: dates,
    });

    await newExpense.save();

    // Once expense is created the update the monthHistory and Year History :
    // If the Document exist it will update ,Otherwise it will create a new Document with the help of  whatever field i have passed in the  filter and update field,If I haven't pass the income field so it will created with default value :

    await MonthHistory.findOneAndUpdate(
      { year, month, date: dates, userId: user.id },
      { $inc: { expense: amount } },
      { upsert: true, new: true }
    );
    // // Year History need to Update here :
    // await YearHistory.findOneAndUpdate(
    //   { userId: user.id, year },
    //   { $inc: { expense: amount } },
    //   { upsert: true, new: true }
    // );

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return NextResponse.json(
        { message: "Invalid category Id" },
        { status: 404 }
      );
    }

    //  Creating a new Transaction :
    const newTransaction = new Transaction({
      categoryName: category.name,
      transactionDate: date,
      description,
      transactionType: "expense",
      amount,
    });

    await newTransaction.save();

    console.log(newTransaction);

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
