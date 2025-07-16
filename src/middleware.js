import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const middleware = async (req) => {
  try {
    const token = req.cookies.get("token")?.value;

    // console.log("middleware", token);

    if (!token) {
      // this code is responsible for redirecting to the UI of login page if error occur mean :
      // If token is missing, redirect to login
      return NextResponse.redirect(new URL("/", req.url));
    }
    // verify the jwt token :

    const user = await jwtVerify(token, secret);
    // console.log("middleware- user", user);

    if (!user) {
      // throw new Error("user not found in token");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // here we are redirecting to the next route:
    return NextResponse.next();
  } catch (error) {
    // console.log("middleware error", error);

    // If token is missing, redirect to login
    return NextResponse.redirect(new URL("/", req.url));
  }
};

// here we need to mention the which are the route to be protected route :
// Basically in this middleware we need to mention the path of frontend which we want to protect:
export const config = {
  matcher: ["/dashboard/:path*"], // protect these routes
};
