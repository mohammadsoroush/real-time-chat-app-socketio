"use client";
import React from "react";
import { UserType } from "@/interfaces";
import {
  RemoveCurrentUserData,
  SetcurrentUserData,
  setonlineUsers,
} from "@/redux/userSlice";
import { GetCurrentUserFromMongo } from "@/serverAction/user-action";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout_ServerAction } from "@/serverAction/logOut";
import socket from "@/config/socketIO-config";

export const Header = () => {
  const dispatch = useDispatch();
  const { currentUserData } = useSelector((state: any) => state.user);

  const [selectedFile, setselectedFile] = React.useState<File | null>(null);
  const [currentUserInfo, setcurrentUserInfo] = React.useState<boolean>(false);

  const GetCurrentUser = async () => {
    try {
      const current = await GetCurrentUserFromMongo();
      console.log("current user in header: ", current);
      if (current) {
        dispatch(SetcurrentUserData(current as UserType));
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData?._id);
      socket.on("online-user-updated", (onlineUserS: string[]) => {
        console.log("onlineUserS:", onlineUserS);
        dispatch(setonlineUsers(onlineUserS)); // 👉 ذخیره در Redux
      });
    }
  }, [currentUserData]);

  React.useEffect(() => {
    GetCurrentUser();
  }, []);

  function InfoRow({ label, value }) {
    return (
      <div className="flex justify-between items-center border-b border-dashed pb-2">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="text-gray-900 truncate">{value}</span>
      </div>
    );
  }

  return (
    <nav className="shadow-sm ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end">
          {currentUserData ? (
            <div className="flex items-center gap-x-3">
              <span className="text-white font-bold">{currentUserData?.name}</span>
              <div className="drawer w-fit drawer-end">
                <input
                  id="my-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">
                  <label
                    htmlFor="my-drawer"
                    className="cursor-pointer drawer-button"
                  >
                    <Image
                      height={40}
                      width={40}
                      src={"/user.png"}
                      alt="profile"
                      className="rounded-full bg-[#f0f8ff]"
                      onClick={() => setcurrentUserInfo(true)}
                    />
                  </label>
                </div>
                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  >
                    close
                  </label>
                  <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-5 flex flex-col">
                    <div className="flex flex-col justify-center items-center gap-3.5">
                      <Image
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : currentUserData?.profilePicture ||
                              "/default-avatar.png"
                        }
                        alt="profile image"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <input
                        type="file"
                        className="file-input file-input-error"
                        onChange={(event) => {
                          if (event.target.files && event.target.files[0]) {
                            setselectedFile(event.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    <div className="divider"></div>
                    <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        اطلاعات حساب کاربر
                      </h3>
                      <div className="space-y-4 text-sm text-gray-700">
                        <InfoRow
                          label="نام کامل:"
                          value={currentUserData?.name}
                        />
                        <InfoRow
                          label="نام کاربری:"
                          value={currentUserData?.userName}
                        />
                        <InfoRow
                          label="شناسه کاربری (ID):"
                          value={currentUserData?._id}
                        />
                        <InfoRow
                          label="تاریخ عضویت:"
                          value={dayjs(currentUserData?.createdAt).format(
                            "YYYY-MM-DD HH:mm"
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <form
                        action={logout_ServerAction}
                        onClick={(e) => {
                          e.preventDefault(); // اول جلوگیری از submit فوری فرم
                          socket.emit("logout", currentUserData?._id); // فرستادن userId به سرور
                          dispatch(RemoveCurrentUserData()); // حذف کاربر از redux
                          e.currentTarget.form?.submit(); // ارسال فرم دستی بعد از همه کارها
                        }}
                      >
                        <button className="btn btn-outline text-red-600 w-full">
                          Logout
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/logIn">
              <button className="relative cursor-pointer  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-1 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative cursor-pointer px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Log In
                </span>
              </button>

              {/* <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Log In
                </button> */}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
