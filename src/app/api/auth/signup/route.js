import { connectDB } from "@/db/connectDB";
import { User } from "@/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    connectDB();
    const { name, email, password } = await req.json();
    console.log(name, email, password);

    // while sending response "status"- should be in second parameter only :
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All field is required",
        },
        { status: 400 }
      );
    }

    //   here we need to check is existing user ?
    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    // hash the password using bcrypt then store it database and set the jwt token to cookie and send the response:

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    // creating token :
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // set the token into cookie for that we need import cookie from next/cookie and along with use set method:

    await cookies().set("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/", // it make the cookie is available for all across our app,if we don't mention this path mean it will be available only for this signup path it will create issue when we try to access other route like "/dashboard"
      sameSite: true,
    });

    // send the response using Next Response don't forgot to return here:
    return NextResponse.json(
      {
        success: true,
        user: { name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error in signup route", error);
    return NextResponse.json(
      {
        success: false,
        message: "server error",
      },
      { status: 500 }
    );
  }
};
