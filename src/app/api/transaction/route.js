import { transactionData } from "@/lib/constant";
import { Transaction } from "@/model/Transaction";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactions = await Transaction.find({
      transactionDate: {
        $gte: start,
        $lte: end,
      },
    });

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.log("Error in transaction GET API -", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const {
      categoryName,
      transactionDate,
      description,
      transactionType,
      amount,
    } = await req.json();
    if (
      !categoryName ||
      !transactionDate ||
      !description ||
      !transactionType ||
      !amount
    ) {
      return NextResponse.json(
        { message: "All the field is required" },
        { status: 400 }
      );
    }

    const newTransaction = new Transaction({
      categoryName,
      transactionDate,
      description,
      transactionType,
      amount,
    });

    await newTransaction.save();

    return NextResponse.json({
      message: "New Transaction is created Successfully",
    });
  } catch (error) {
    console.log("Error in transaction POST API -", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
