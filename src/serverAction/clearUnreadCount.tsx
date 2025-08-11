"use server";
import { ConnetMongoDB } from "@/config/db.config";
import chatModel from "@/models/chatModel";
import messageModel from "@/models/messageModel"; // فرض بر اینه که مدل پیام‌ها رو دارید

export const clearUnreadCount_AddUnreadBy = async (chatId: string, userId: string) => {
  console.log("clearing for userId:", userId);

  try {
    const updatedChat = await chatModel.findByIdAndUpdate(
      chatId,
      { $set: { [`unreadCounts.${userId}`]: 0 } },
      { new: true }
    );

    console.log("AFTER CLEAR:", updatedChat?.unreadCounts);

    await messageModel.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId }, 
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } } 
    );

    return { success: true };
  } catch (error) {
    console.error("clearUnreadCount error:", error);
    return { error: "Failed to clear unread count" };
  }
};
