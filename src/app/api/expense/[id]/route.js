import { connectDB } from "@/db/connectDB";
import { Expense } from "@/model/Expense";
import { MonthHistory } from "@/model/MonthHistory";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// To get the particular expense based on Category :
export async function GET(request, { params }) {
  const { id: categoryId } = await params;
  try {
    await connectDB();

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Category ID" },
        { status: 400 }
      );
    }

    const list = await Expense.find({ categoryId });
    return NextResponse.json({ success: true, category: list });
  } catch (error) {
    console.log("error is from Expense GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// To Update the Existing expenses using expenseID :
export async function PUT(req, { params }) {
  const { id: expenseId } = await params;
  let updatedExpense = await req.json();
  try {
    await connectDB();

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Category ID" },
        { status: 400 }
      );
    }

    // User Not allow to edit Date :
    if (updatedExpense.date) {
      return NextResponse.json({
        success: false,
        message: "Date field not allowed to edit",
      });
    }

    //  Let's find the old Expense :
    const oldExpense = await Expense.findById(expenseId);
    // console.log("old expense", oldExpense);

    if (!oldExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense Not found",
        },
        { status: 404 }
      );
    }

    // let oldDate = new Date(oldExpense.date);
    let oldAmount = Number(oldExpense.amount);
    // console.log("old Amount", oldAmount);

    // const updateDate = new Date(updatedExpense.date);
    let newAmount = Number(updatedExpense.amount);

    if (newAmount) {
      // Revert old expense amount from old month history
      await MonthHistory.findOneAndUpdate(
        {
          userId: oldExpense.userId,
          year: oldExpense.year,
          month: oldExpense.month,
          date: oldExpense.date,
        },
        { $inc: { expense: -oldAmount } }
      );

      //  Add new expense amount to new month history (upsert in case not exists)
      await MonthHistory.findOneAndUpdate(
        {
          userId: oldExpense.userId,
          year: oldExpense.year,
          month: oldExpense.month,
          date: oldExpense.date,
        },
        { $inc: { expense: newAmount } },
        { upsert: true, new: true }
      );

      //  Revert old expense amount from old year history
      await YearHistory.findOneAndUpdate(
        { userId: oldExpense.userId, year: oldExpense.year },
        { $inc: { expense: -oldAmount } }
      );

      // Add new expense amount to new year history
      await YearHistory.findOneAndUpdate(
        { userId: oldExpense.userId, year: oldExpense.year },
        { $inc: { expense: newAmount } },
        { upsert: true, new: true }
      );
    }

    let expense = await Expense.findByIdAndUpdate(
      { _id: expenseId },
      updatedExpense,
      { new: true }
    );

    if (!expense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expense Updated Successfully",
      updatedExpense: expense,
    });
  } catch (error) {
    console.log("error is from Expense PUT fn", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id: expenseId } = await params;

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Category ID" },
        { status: 400 }
      );
    }

    // Using the expense ID get the data from the expense :
    const expenseData = await Expense.findById(expenseId);
    if (!expenseData) {
      return NextResponse.json(
        { success: false, message: "Expense Not Found" },
        { status: 404 }
      );
    }

    // extract the date,month,year,userId from expense find the MonthHistory and YearHistory -> subtract the value from both

    let newDate = new Date(expenseData.date);
    let newDay = newDate.getDate();
    let newMonth = newDate.getMonth() + 1;
    let newYear = newDate.getFullYear();

    const deletedExpense = await Expense.findByIdAndDelete({ _id: expenseId });

    if (!deletedExpense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    // Delete from Month History :
    await MonthHistory.findOneAndUpdate(
      {
        userId: expenseData.userId,
        date: newDay,
        month: newMonth,
        year: newYear,
      },
      { $inc: { expense: -expenseData.expense } }
    );

    // Delete from Year History :
    await YearHistory.findOneAndUpdate(
      {
        userId: expenseData.userId,
        date: newDay,
        month: newMonth,
        year: newYear,
      },
      { $inc: { expense: -expenseData.expense } }
    );
    return NextResponse.json(
      { success: true, message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error is from Expense DELETE fn", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
