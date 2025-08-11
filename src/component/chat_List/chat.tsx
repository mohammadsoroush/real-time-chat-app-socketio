import React from "react";
import { ChatHeader } from "./chatHeader";
import { ChatList } from "./chatList";
import { getAllUser } from "@/serverAction/user-action";

export const Chat = () => {
  return (
    <div className="flex-1/4 min-w-[160px] flex flex-col gap-y-[20px] ">
      <ChatHeader />
      <ChatList />
    </div>
  );
};
