"use server";

import { ConnetMongoDB } from "@/config/db.config"; // اطمینان از اتصال
import messageModel from "@/models/messageModel";
import chatModel from "@/models/chatModel";

export const sendNewMessage = async (payload: {
  chat: string;
  sender: string;
  text?: string;
  image?: string;
}) => {
  try {
    await ConnetMongoDB();

    const newMessage = await messageModel.create(payload);

    const existingChat = await chatModel.findById(payload.chat);

    if (!existingChat) {
      return { success: false, error: "Chat not found" };
    }

    const updatedUnreadCount = { ...(existingChat.unreadCounts as any) };

    existingChat.users.forEach((user: any) => {
      const userIdStr = user.toString();
      if (userIdStr !== payload.sender) {
        updatedUnreadCount[userIdStr] =
          (updatedUnreadCount[userIdStr] || 0) + 1;
      }
    });

    await chatModel.findByIdAndUpdate(payload.chat, {
      unreadCounts: updatedUnreadCount,
      lastMessage: newMessage._id,
    });

    return {
      success: true,
      message: "Message sent successfully!",
      data: JSON.parse(JSON.stringify(newMessage)),
    };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, error: "Message not saved." };
  }
};

export const GetMessagesFromMessageModal = async (chatId: string) => {
  try {
    const message = await messageModel
      .find({ chat: chatId })
      .populate("sender")
      .sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(message));
  } catch (error: any) {
    return { error: error.message };
  }
};
