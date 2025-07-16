import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { Income } from "@/model/Income";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const user = await getUserFromCookie();
  console.log(user);

  try {
    await connectDB();

    const { month, year } = await params;

    console.log(typeof month, year);

    if (!month || !year) {
      return NextResponse.json(
        { message: "Month and year are required" },
        { status: 400 }
      );
    }
    console.log(Number(month), Number(year), user.id);

    const incomes = await Income.find({
      userId: user.id,
      month: Number(month),
      year: Number(year),
    }).select("amount date month year description");

    console.log(incomes);

    return NextResponse.json(incomes);
  } catch (error) {
    console.log("error is from Expense/month GET fn", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
