"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout_ServerAction = async () => {
   (await cookies()).delete("token");

  redirect("/");
};
