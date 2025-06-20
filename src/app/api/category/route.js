import { connectDB } from "@/db/connectDB";
import { Category } from "@/model/Category";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const categoryList = await Category.find({});
    return NextResponse.json({ category: categoryList });
  } catch (error) {
    console.log("error is from Category GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await connectDB();

    const { name, userId, emoji } = await req.json();

    //  checking the all the is valid or not
    if (!name || !userId || !emoji) {
      return NextResponse.json(
        { success: false, message: "All the field is required" },
        { status: 400 }
      );
    }

    // checking whether userId is valid mongo db id or not :
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      name,
      userId,
      emoji,
    });

    await newCategory.save();

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log("error is from Category post fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
