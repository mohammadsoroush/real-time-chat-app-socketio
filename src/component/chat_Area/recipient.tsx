"use client";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSelector } from "react-redux";
import { chatType } from "@/interfaces";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import socket from "@/config/socketIO-config";

export const Recipient = () => {
  const [typing, setTyping] = useState<boolean>(false);
  const [typing_name_in_group, set_typing_name_in_group] = useState<string>("");
  const router = useRouter();
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  ) as chatType | null;

  const { currentUserData } = useSelector((state: RootState) => state.user);

  let chatName = "";
  let chatImage = "";

  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupProfilePicture || "/user.png";
  } else {
    const recipient = selectedChat?.users.find(
      (user: any) => user._id !== currentUserData?._id
    );
    chatName = recipient?.name || "Unknown";
    chatImage = recipient?.profilePicture || "/user.png";
  }

  const typingAnimation = () => {
    if (typing) {
      return <span className="text-green-500 text-sm">Typing...</span>;
    }
  };

  useEffect(() => {
    const handler = ({ Chat, name }: { Chat: chatType; name: string }) => {
      if (Chat?._id === selectedChat?._id) {
        setTyping(true);
        if (Chat.isGroupChat) {
          set_typing_name_in_group(name);
        }
      }

      setTimeout(() => {
        setTyping(false);
        set_typing_name_in_group("");
      }, 2000);
    };

    socket.on("typing", handler);

    return () => {
      socket.off("typing", handler);
    };
  }, [selectedChat]);

  return (
    <div className="flex items-center gap-x-3">
      <div className="drawer drawer-end">
        <input id="my-drawer2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer2" className="cursor-pointer drawer-button">
            <div className="flex items-center gap-x-2">
              <Image
                src={chatImage}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full bg-[#f0f8ff]"
              />
              <div className="flex flex-row items-center gap-2">
                <p className="text-white font-bold">{chatName}</p>
                {typing && (
                  <span className="text-black text-xs animate-pulse">
                    {typing_name_in_group !== ""
                      ? `${typing_name_in_group} is
                     Typing...`
                      : `Typing...`}
                  </span>
                )}
              </div>
            </div>
          </label>
        </div>
        <div className="drawer-side z-40">
          <label
            htmlFor="my-drawer2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <div className="min-h-full w-80 bg-white p-4 shadow-lg flex flex-col gap-4 relative">
            {/* Close Button */}
            <label
              htmlFor="my-drawer2"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 cursor-pointer text-xl"
            >
              ✕
            </label>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center text-gray-800 mt-8">
              Chat Info
            </h2>

            {/* Profile Image */}
            <div className="flex justify-center">
              <Image
                src={chatImage}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full border border-gray-300"
              />
            </div>
            <button
              onClick={() =>
                router.push(`/group/edit-group/${selectedChat?._id}`)
              }
              className="btn"
            >
              Edit Group
            </button>

            {selectedChat?.isGroupChat && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">
                  Group Members
                </h3>
                <div className="flex flex-col gap-3">
                  {selectedChat.users.map((user: any) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
                    >
                      <Image
                        src={user.profilePicture || "/user.png"}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-300"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{user.userName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Name */}
            <p className="text-center text-gray-800 text-md font-bold">
              {chatName}
            </p>

            {/* Creator */}
            {selectedChat?.createdBy?.name && (
              <p className="text-center text-sm text-gray-600">
                Created by:{" "}
                <span className="font-medium text-gray-700">
                  {selectedChat.createdBy.name}
                </span>
              </p>
            )}

            {/* Created At */}
            {selectedChat?.createdAt && (
              <p className="text-center text-sm text-gray-500">
                Created on:{" "}
                {dayjs(selectedChat.createdAt).format("YYYY/MM/DD - HH:mm")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
