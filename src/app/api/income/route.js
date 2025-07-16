import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { Income } from "@/model/Income";
import { MonthHistory } from "@/model/MonthHistory";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Category } from "@/model/Category";
import { Transaction } from "@/model/Transaction";

export async function GET() {
  const user = await getUserFromCookie();

  try {
    await connectDB();
    const incomeList = await Income.aggregate([
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
    console.log(incomeList);

    return NextResponse.json({ success: true, incomeList }, { status: 200 });
  } catch (error) {
    console.log("error is from Income GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserFromCookie();
  // console.log(" user-data from income route", user, user.id);

  try {
    await connectDB();
    const { amount, description, categoryId, date } = await request.json();
    // console.log("API-Income route");

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

    // here we need to update the MonthHistory and YearHistory :
    const incomeDate = new Date(date);
    const day = incomeDate.getDate();
    const month = incomeDate.getMonth() + 1;
    const year = incomeDate.getFullYear();

    // Creating new Expense :
    const newIncome = new Income({
      userId: user.id,
      amount,
      description,
      categoryId,
      date: day,
      month,
      year,
    });

    await newIncome.save();

    // Update month history
    await MonthHistory.findOneAndUpdate(
      { userId: user.id, date: day, month, year },
      { $inc: { income: amount } },
      { upsert: true, new: true }
    );

    // // Update year history
    // await YearHistory.findOneAndUpdate(
    //   { userId: user.id, year },
    //   { $inc: { income: amount } },
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
      transactionType: "income",
      amount,
    });

    await newTransaction.save();

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
