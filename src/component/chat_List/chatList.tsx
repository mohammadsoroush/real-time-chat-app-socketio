"use client";

import { chatState, setChat, setSelectedChat } from "@/redux/chatSlice";
import { GetAllChats } from "@/serverAction/chat-action";
import {
  clearUnreadCount,
  clearUnreadCount_AddUnreadBy,
} from "@/serverAction/clearUnreadCount";
import { OnlineIndicator } from "./OnlineIndicator";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/config/socketIO-config";
import { messageType } from "@/interfaces";

export const ChatList = () => {
  const dispatch = useDispatch();
  const { currentUserData } = useSelector((state: any) => state.user);
  const { chat, selectedChat }: chatState = useSelector(
    (state: any) => state.chat
  );

  const getChat = async () => {
    try {
      if (!currentUserData?._id) return;
      console.log("currentUserData:", currentUserData);
      const response = await GetAllChats(currentUserData._id);
      if (response.error) throw new Error(response.error);
      dispatch(setChat(response));
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    getChat();
  }, [currentUserData]);

  useEffect(() => {
    if (!currentUserData) return;

    const handler = (newMessage: messageType) => {
      const prevChats = [...chat];

      const indexOfChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );

      // اگه چت وجود نداشت، چت جدید اضافه کن
      if (indexOfChatToUpdate === -1) {
        const newChat = {
          ...newMessage.chat,
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
          unreadCounts: {
            [currentUserData._id]:
              selectedChat?._id !== newMessage.chat._id ? 1 : 0,
          },
        };

        const updatedChats = [newChat, ...prevChats];
        dispatch(setChat(updatedChats));
        return;
      }

      // اگه چت وجود داشت، آپدیتش کن
      const chatToUpdate = { ...prevChats[indexOfChatToUpdate] };
      chatToUpdate.lastMessage = newMessage;
      chatToUpdate.updatedAt = newMessage.createdAt;
      chatToUpdate.unreadCounts = { ...chatToUpdate.unreadCounts };

      console.log("💡 currentUserData?.id:", currentUserData?._id);

      if (
        currentUserData?._id &&
        newMessage.sender._id !== currentUserData._id &&
        selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdate.unreadCounts ??= {};
        chatToUpdate.unreadCounts[currentUserData._id] =
          (chatToUpdate.unreadCounts[currentUserData._id] ?? 0) + 1;

        console.log(
          "✅ Unread count incremented for user:",
          currentUserData._id
        );
        console.log("📊 Updated unreadCounts:", chatToUpdate.unreadCounts);
      }

      const updatedChats = [
        chatToUpdate,
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ];

      dispatch(setChat(updatedChats));
    };

    socket.on("new-message-received", handler);

    return () => {
      socket.off("new-message-received", handler);
    };
  }, [selectedChat, chat, currentUserData, dispatch]);

  // شرط نمایش در انتهای کامپوننت - بعد از تمام hookها
  if (!currentUserData || !currentUserData._id) {
    return (
      <div className="flex-[80%] flex flex-col gap-2 px-2 py-2 overflow-y-auto">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-[80%] flex flex-col gap-2 px-2 py-2 overflow-y-auto">
      {chat.length === 0 && (
        <p className="text-center text-gray-400">No chats yet</p>
      )}

      {chat.map((chatItem) => {
        let chatName = "";
        let chatImage = "";
        let lastMessage = chatItem.lastMessage?.text || "";
        let lastMessageSenderName = chatItem.lastMessage?.sender?.name || "";
        let lastMessageTime = new Date(chatItem.updatedAt).toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        );
        const unreadCount = chatItem.unreadCounts?.[currentUserData._id] || 0;

        if (chatItem.isGroupChat) {
          chatName = chatItem.groupName;
          chatImage = chatItem.groupProfilePicture || "/user.png";
        } else {
          const recipient = chatItem.users.find(
            (user) => user._id !== currentUserData._id
          );
          chatName = recipient?.name || "Unknown";
          chatImage = recipient?.profilePicture || "/user.png";
        }

        const isSelected = selectedChat?._id === chatItem._id;

        return (
          <div
            key={chatItem._id}
            onClick={async () => {
              dispatch(setSelectedChat(chatItem));
              await clearUnreadCount_AddUnreadBy(
                chatItem._id,
                currentUserData._id
              );
              await getChat();
            }}
            className={`flex items-center gap-4 p-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-gray-300 shadow-md"
                : "hover:bg-gray-100 bg-white"
            }`}
          >
            <div className="relative">
              {chatItem.isGroupChat ? (
                <i className="ri-group-fill text-3xl"></i>
              ) : (
                <i className="ri-user-fill text-3xl"></i>
              )}
              {/* <Image
                src={chatImage}
                width={48}
                height={48}
                alt="chat image"
                className="rounded-full object-cover border border-gray-300"
              /> */}
              <OnlineIndicator
                isGroupChat={chatItem.isGroupChat}
                users={chatItem.users}
              />
            </div>

            <div className="flex flex-col flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {chatName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {lastMessageSenderName && `${lastMessageSenderName}: `}
                {lastMessage}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-gray-400">
                {lastMessageTime}
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
