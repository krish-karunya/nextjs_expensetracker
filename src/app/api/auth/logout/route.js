import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    (await cookies()).set("token", "", {
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({
      success: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.log("Error in logout route", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "server error",
    });
  }
};
