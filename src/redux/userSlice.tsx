import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUserData: null,
    currentUserId: "",
    onlineUsers: [],
  },
  reducers: {
    setonlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    RemoveCurrentUserData: (state) => {
      state.currentUserData = null;
    },
    SetcurrentUserData: (state, action) => {
      state.currentUserData = action.payload;
    },

    SetcurrentUserId: (state, action) => {
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

export default userSlice;
