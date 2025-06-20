import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const middleware = async (req) => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      // this code is responsible for redirecting to the UI of login page if error occur mean :
      // If token is missing, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // verify the jwt token :

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      throw new Error("user not found in token");
    }

    // here we are redirecting to the next route:
    return NextResponse.next();
  } catch (error) {
    // If token is missing, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
};

// here we need to mention the which are the route to be protected route :
// Basically in this middleware we need to mention the path of frontend which we want to protect:
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/category/:path*"], // protect these routes
};
