import { connectDB } from "@/db/connectDB";
import { Transaction } from "@/model/Transaction";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    console.log("transaction id ->", id);

    // Check the ID is valid or not :
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Category ID" },
        { status: 400 }
      );
    }

    const transactionData = await Transaction.findByIdAndDelete(id);

    if (!transactionData) {
      return NextResponse.json(
        { success: false, message: "transactionData Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error is from Transaction DELETE fn", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
