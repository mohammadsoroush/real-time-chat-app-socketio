import { chatType } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
    selectedChat: null,
  },
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChat, setSelectedChat } = chatSlice.actions;
export default chatSlice;

export interface chatState {
  chat: chatType[];
  selectedChat: chatType | null;
}
