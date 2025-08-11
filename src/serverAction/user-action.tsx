// ✅ user-action.ts (با JWT و بدون Clerk)
"use server";

import { ConnetMongoDB } from "@/config/db.config";
import userModel from "@/models/userModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GetCurrentUserFromMongo = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await ConnetMongoDB();
    const user = await userModel.findById(decoded.userId).lean();
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
};

export const getAllUser = async () => {
  try {
    await ConnetMongoDB();
    const users = await userModel.find({}).lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return error;
  }
};
