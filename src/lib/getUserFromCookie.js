import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getUserFromCookie = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }
  //   here if it get any error while verifying the token it return null
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    return null;
  }
};
