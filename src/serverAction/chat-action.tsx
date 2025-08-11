"use server";

import chatModel from "@/models/chatModel";

export const CreateNewChat = async (formdata: FormData) => {
  console.log("formadata:", formdata);
  const curretUserId = formdata.get("currentUserId") as string;
  const targetUserId = formdata.getAll("targetUserId") as string[];
  const createdBy = formdata.get("createdBy") as string;
  const isGroupChat = formdata.get("isGroupChat") === "true";
  const groupName = formdata.get("groupName") as string;
  const groupBio = formdata.get("groupBio") as string;
  console.log("curretUserId", curretUserId);
  console.log("targetUserId", targetUserId);

  try {
    const allUsers = [curretUserId, ...targetUserId];
    const newChat = await chatModel.create({
      users: allUsers,
      createdBy,
      isGroupChat,
      groupName,
      groupBio,
    });
    return {
      success: true,
      chat: JSON.parse(JSON.stringify(newChat)),
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, error: "Error creating chat" };
  }
};

export const GetAllChats = async (userId: string) => {
  try {
    const chats = await chatModel
      .find({
        users: { $in: [userId] },
      })
      .populate("users")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          model: "users",
        },
      });
    return JSON.parse(JSON.stringify(chats));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getChatDataById = async (chatId: string) => {
  try {
    const chat = await chatModel
      .findById(chatId)
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
        },
      });

    return JSON.parse(JSON.stringify(chat));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateChat = async (
  chatId: string,
  payload: any
): Promise<{ message?: string; error?: string }> => {
  console.log("payload in updateChat:", payload);
  try {
    await chatModel.findByIdAndUpdate(chatId, payload);
    return { message: "Chat updated successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
};
