import { connectDB } from "@/db/connectDB";
import { Category } from "@/model/Category";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // don't forgot to write await in front of params and also above 1st parameter should alway request after that only param should come
  const { id: categoryId } = await params;
  try {
    await connectDB();

    // checking whether userId is valid mongo db id or not :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "category not found",
      });
    }

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.log("error is from Category GET fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id: categoryId } = await params;
  const category = await req.json();
  // console.log(category);

  try {
    await connectDB();

    // checking whether userId is valid mongo db id or not :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      category,
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log("error is from Category PUT fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  const { id: categoryId } = await params;
  try {
    await connectDB();

    // checking whether userId is valid mongo db id or not :
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    const deleteCategory = await Category.findByIdAndDelete(categoryId);

    if (!deleteCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: ` ${deleteCategory.name} Category Deleted Successfully`,
    });
  } catch (error) {
    console.log("error is from Category DELETE fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
