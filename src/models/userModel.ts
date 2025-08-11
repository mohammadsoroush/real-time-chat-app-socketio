import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // clerkUserId: { type: String, require: true, unique: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["users"]) {
  mongoose.deleteModel("users");
}

const userModel = mongoose.model("users", userSchema);
export default userModel;
