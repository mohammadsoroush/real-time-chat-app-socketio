import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/interfaces"; // اگر لازم داری اینجا وارد کن

interface UserState {
  currentUserData: UserType | null;
  currentUserId: string;
  onlineUsers: string[]; // فقط شناسه‌ها (آیدی‌ها) ذخیره میشه
}

const initialState: UserState = {
  currentUserData: null,
  currentUserId: "",
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setonlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    RemoveCurrentUserData: (state) => {
      state.currentUserData = null;
    },
    SetcurrentUserData: (state, action: PayloadAction<UserType>) => {
      state.currentUserData = action.payload;
    },
    SetcurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
  },
});

export const {
  SetcurrentUserData,
  SetcurrentUserId,
  RemoveCurrentUserData,
  setonlineUsers,
} = userSlice.actions;

export default userSlice.reducer;
