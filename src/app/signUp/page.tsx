"use client";

import { RegisterAction } from "@/serverAction/RegisterAction";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { SetcurrentUserData } from "@/redux/userSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [state, formAction] = useActionState(RegisterAction, null);

  useEffect(() => {
    if (state?.success && state.user) {
      dispatch(SetcurrentUserData(state.user));
      router.replace("/");
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-6">
          ثبت‌ نام
        </h2>
        <form action={formAction} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="نام کامل"
            required
            className="input-style"
          />
          <input
            name="userName"
            placeholder="نام کاربری"
            required
            className="input-style"
          />
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
            className="bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700 transition"
          >
            ثبت‌ نام
          </button>
        </form>

        {state?.error && (
          <p className="text-red-500 mt-3 text-sm text-center">{state.error}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          قبلاً ثبت‌ نام کردی؟{" "}
          <Link href="/logIn" className="text-amber-600 hover:underline">
            وارد شو
          </Link>
        </p>
      </div>
    </div>
  );
}
