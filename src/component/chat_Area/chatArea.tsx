"use client";
import React from "react";
import { Recipient } from "./recipient";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Message } from "./message";
import { Send_Message } from "./send_Message";

export const ChatArea = () => {
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  console.log("selectedChat", selectedChat);

  if (!selectedChat) {
    return (
      <div className="flex flex-3/4  flex-col items-center justify-center">
        <Image
          src={"/Chat-removebg-preview.png"}
          height={250}
          width={250}
          alt="chat logo"
        />
        <p className="text-white">select message to start chat...</p>
      </div>
    );
  }

  return (
    <div className="flex-3/4 gap-[20px] flex flex-col">
      <Recipient />
      <Message />
      <Send_Message />
    </div>
  );
};
