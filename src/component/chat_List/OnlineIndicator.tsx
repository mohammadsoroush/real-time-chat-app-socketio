"use client";

import { useSelector } from "react-redux";

interface OnlineIndicatorProps {
  isGroupChat: Boolean;
  users: any[];
}

export const OnlineIndicator = ({
  isGroupChat,
  users,
}: OnlineIndicatorProps) => {
  const { currentUserData, onlineUsers } = useSelector(
    (state: any) => state.user
  );

  if (isGroupChat || !currentUserData) return null;

  const recipient = users.find((user) => user._id !== currentUserData._id);
  const recipientId = recipient?._id;

  if (onlineUsers?.includes(recipientId)) {
    return (
      <div className="w-3 h-3 rounded-full bg-green-700 absolute bottom-0 right-0 border-2 border-white" />
    );
  }

  return null;
};
