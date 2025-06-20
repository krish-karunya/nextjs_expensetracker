import { connectDB } from "@/db/connectDB";
import { Income } from "@/model/Income";
import { MonthHistory } from "@/model/MonthHistory";
import { YearHistory } from "@/model/YearHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id: categoryId } = params;
  try {
    await connectDB();
    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Category ID" },
        { status: 400 }
      );
    }

    const list = await Income.find({ categoryId });
    return NextResponse.json({ success: true, category: list });
  } catch (error) {
    console.log("error is from Income GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id: incomeId } = params;
  const updatedIncome = await req.json();

  try {
    await connectDB();

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(incomeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Income ID" },
        { status: 400 }
      );
    }

    const oldIncome = await Income.findById(incomeId);

    if (!oldIncome) {
      return NextResponse.json(
        {
          success: false,
          message: "Income Not found",
        },
        { status: 404 }
      );
    }

    let oldDate = new Date(oldIncome.date);
    let oldAmount = oldIncome.amount;
    let oldDay = oldDate.getDate();
    let oldMonth = oldDate.getMonth() + 1;
    let oldYear = oldDate.getFullYear();

    const updateDate = new Date(updatedIncome.date);
    let newAmount = updateDate.amount;
    let newDay = updateDate.getDate();
    let newMonth = updateDate.getMonth() + 1;
    let newYear = updateDate.getFullYear();

    // Revert old income amount from old month history
    await MonthHistory.findOneAndUpdate(
      {
        userId: oldIncome.userId,
        year: oldYear,
        month: oldMonth,
        date: oldDay,
      },
      { $inc: { income: -oldAmount } }
    );

    //  Add new income amount to new month history (upsert in case not exists)
    await MonthHistory.findOneAndUpdate(
      {
        userId: oldIncome.userId,
        year: newYear,
        month: newMonth,
        date: newDay,
      },
      { $inc: { income: newAmount } },
      { upsert: true, new: true }
    );

    //  Revert old income amount from old year history
    await YearHistory.findOneAndUpdate(
      { userId: oldIncome.userId, year: oldYear },
      { $inc: { income: -oldAmount } }
    );

    // Add new income amount to new year history
    await YearHistory.findOneAndUpdate(
      { userId: oldIncome.userId, year: newYear },
      { $inc: { income: newAmount } },
      { upsert: true, new: true }
    );

    const income = await Income.findByIdAndUpdate(
      { _id: incomeId },
      updatedIncome,
      { new: true }
    );

    if (!income) {
      return NextResponse.json(
        { success: false, message: "Income not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Income Updated Successfully",
      income,
    });
  } catch (error) {
    console.log("error is from Income PUT fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  const { id: IncomeId } = params;
  try {
    await connectDB();

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(IncomeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Income ID" },
        { status: 400 }
      );
    }

    // find the income using IncomeId :
    const incomeData = await Income.findById(IncomeId);

    if (!IncomeId) {
      return NextResponse.json(
        { success: false, message: "Income Not Found" },
        { status: 404 }
      );
    }
    const deletedIncome = await Income.findByIdAndDelete({ _id: IncomeId });

    if (!deletedIncome) {
      return NextResponse.json(
        { success: false, message: "Income not found" },
        { status: 404 }
      );
    }
    let incomeDate = new Date(incomeData.date);
    let date = incomeDate.getDate();
    let month = incomeDate.getMonth();
    let year = incomeDate.getFullYear();

    // Update the MonthHistory and YearHistory :
    await MonthHistory.findOneAndUpdate(
      {
        userId: incomeData.userId,
        date,
        month,
        year,
      },
      { $inc: { income: -incomeDate.income } }
    );

    // Update the YearHistory :
    await YearHistory.findOneAndUpdate(
      {
        userId: incomeData.userId,
        date,
        month,
        year,
      },
      { $inc: { income: -incomeDate.income } }
    );

    return NextResponse.json(
      { success: true, message: "Income deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error is from Income DELETE fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
