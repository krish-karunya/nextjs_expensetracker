import { connectDB } from "@/db/connectDB";
import { User } from "@/model/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    // Connect to DB first :
    await connectDB();

    // don't forgot to write await in front of request
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All field is required" },
        { status: 400 }
      );
    }

    // find the user in database :
    const user = await User.findOne({ email });

    // if the user not available in database or password in correct mean send the response as invalid credential:
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Invalid credential" },
        { status: 401 }
      );
    }

    // create jwt token and set in cookie:

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await cookies().set("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
      sameSite: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully",
        user: { name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error is from User post fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const user = await User.find({});

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.log("error is from User post fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
  } catch (error) {
    console.log("error is from User PUT fn");
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
