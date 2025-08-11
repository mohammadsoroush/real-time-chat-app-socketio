"use client";

import { SetcurrentUserData } from "@/redux/userSlice";
import { LoginAction } from "@/serverAction/LoginAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const [state, formAction] = useActionState(LoginAction, null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.user) {
      dispatch(SetcurrentUserData(state.user));
      router.replace("/");
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          ورود به حساب
        </h2>

        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="ایمیل"
            required
            className="input-style"
          />
          <input
            name="password"
            type="password"
            placeholder="رمز عبور"
            required
            className="input-style"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            ورود
          </button>
        </form>

        {state?.error && (
          <p className="text-red-500 mt-3 text-sm text-center">{state.error}</p>
        )}

        {state?.success && (
          <p className="text-green-600 mt-3 text-sm text-center">
            ورود موفق بود
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          حساب نداری؟{" "}
          <Link href="/signUp" className="text-blue-600 hover:underline">
            ثبت‌ نام کن
          </Link>
        </p>
      </div>
    </div>
  );
}
