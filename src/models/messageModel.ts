import mongoose from "mongoose";

const messageScheme = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },

    socketMessageId: {
      type: String,
      default: "",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["messages"]) {
  mongoose.deleteModel("messages");
}
const chatModel = mongoose.model("messages", messageScheme);
export default chatModel;
