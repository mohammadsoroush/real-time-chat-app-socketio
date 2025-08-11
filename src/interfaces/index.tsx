export interface UserType {
  createdAt: string; // تاریخ به صورت ISO string
  email: string;
  name: string;
  profilePicture: string; // URL عکس پروفایل
  updatedAt: string; // تاریخ به صورت ISO string
  userName: string;
  _id: string; // شناسه MongoDB
}

export interface chatType {
  _id: string;
  users: UserType[];
  createdBy: UserType;
  lastMessage: messageType;
  isGroupChat: boolean;
  groupName: string;
  groupProfilePicture: string;
  groupBio: string;
  unreadCounts: any;
  groupAdmins: UserType[];
  createdAt: string;
  updatedAt: string;
}

export interface messageType {
  _id: String;
  chat: chatType;
  sender: UserType;
  socketMessageId: String;
  text: String;
  image: String;
  readBy: UserType[];
  createdAt: string;
  updatedAt: string;
}
