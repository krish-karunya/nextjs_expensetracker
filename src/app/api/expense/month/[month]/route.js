import { Expense } from "@/model/Expense";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // const { searchParams } = new URL(request.url);
    // const month = parseInt(searchParams.get("month"));
    const { month } = await params;
    console.log(month);

    const expenses = await Expense.find({
      $expr: {
        $eq: [{ $month: "$date" }, month],
      },
    });
    console.log("expense", expenses);

    const expenseList = await Expense.find({});
    return NextResponse.json({ expenseList });

    // console.log(id);cls
  } catch (error) {
    console.log("error is from Expense/month GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
