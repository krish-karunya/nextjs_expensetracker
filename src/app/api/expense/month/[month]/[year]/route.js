import { connectDB } from "@/db/connectDB";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { Expense } from "@/model/Expense";
import { MonthHistory } from "@/model/MonthHistory";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const user = await getUserFromCookie();
  console.log(user);

  try {
    await connectDB();

    const { month, year } = await params;

    if (!month || !year) {
      return NextResponse.json(
        { message: "Month and year are required" },
        { status: 400 }
      );
    }

    const expenses = await Expense.find({
      userId: user.id,
      month: Number(month),
      year: Number(year),
    }).select("amount date month year description");

    console.log(expenses);

    return NextResponse.json({ expenses });
  } catch (error) {
    console.log("error is from Expense/month GET fn", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// How to access the Search params in Next js 15 :

// NextRequest is a special request object provided by Next.js that wraps the standard Fetch API Request object.

// It's used in API routes, middleware, and edge functions.

// It gives you access to request-specific data like headers, cookies, body, and URL.

// Behind the scene it will create a Object and assign the URL ,key which we passed from frontend :
// const { searchParams } = new URL(req.url);
// const month = searchParams.get("month"); // using get method we can access it like this :
// const year = searchParams.get("year");
// console.log("month", month, "year", year);
