"use server";

import { ConnetMongoDB } from "@/config/db.config";
import userModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function LoginAction(prevState: any, formData: FormData) {
  await ConnetMongoDB();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await userModel.findOne({ email });
  if (!user) {
    return { error: "کاربری با این ایمیل پیدا نشد" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "رمز عبور اشتباه است" };
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, user: JSON.parse(JSON.stringify(user)) };
}
