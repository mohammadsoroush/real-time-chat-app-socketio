"use server";

import { ConnetMongoDB } from "@/config/db.config";
import userModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const RegisterAction = async (prevState: any, formData: FormData) => {
  await ConnetMongoDB();

  const name = formData.get("name") as string;
  const userName = formData.get("userName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existing = await userModel.findOne({ email });
  if (existing) {
    return { error: "کاربری با این ایمیل وجود دارد" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    name,
    userName,
    email,
    password: hashedPassword,
    profilePicture: "",
    bio:""
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return {
    success: true,
    user: JSON.parse(JSON.stringify(newUser)),
  };
};
