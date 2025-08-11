import { chatType } from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  // اینجا export اضافه شد
  chat: chatType[];
  selectedChat: chatType | null;
}

const initialState: ChatState = {
  chat: [],
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<chatType[]>) => {
      state.chat = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<chatType | null>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChat, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
