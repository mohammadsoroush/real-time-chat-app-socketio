"use client";
import { UserType } from "@/interfaces";
import { RootState } from "@/redux/store";
import { CreateNewChat, updateChat } from "@/serverAction/chat-action";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSelector } from "react-redux";

export const Group_form = ({
  user,
  initialData = null,
}: {
  user: UserType[];
  initialData?: any;
}) => {
  console.log("initial:", initialData);
  const router = useRouter();
  const { currentUserData } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<string[]>(
    initialData?.users?.map((user) => user) || []
  );

  console.log("userId:", userId);
  const [groupName, setGroupName] = useState(initialData?.groupName || "");
  const [description, setDescription] = useState(initialData?.groupBio || "");

  const toggleUserId = (id: string) => {
    if (userId.includes(id)) {
      setUserId((prev) => prev.filter((uid) => uid !== id));
    } else {
      setUserId((prev) => [...prev, id]);
    }
  };

  const handleSubmit = async () => {
    console.log("groupName", groupName);

    try {
      const formData = new FormData();

      formData.append("isGroupChat", "true");
      formData.append("groupName", groupName.trim());
      formData.append("groupBio", description.trim());
      formData.append("groupProfilePicture", ""); // یا عکس

      formData.append("createdBy", currentUserData?._id || "");
      formData.append("currentUserId", currentUserData?._id || "");
      console.log("userId before for each:", userId);
      userId.forEach((id) => {
        formData.append("targetUserId", id);
      });
      let response = null;
      if (initialData) {
        const dataToUpdate = {
          isGroupChat: true,
          groupName: groupName.trim(),
          groupBio: description.trim(),
          groupProfilePicture: "", 
          createdBy: currentUserData?._id || "",
          currentUserId: currentUserData?._id || "",
          targetUserIds: userId,
        };

        response = await updateChat(initialData._id, dataToUpdate);
      } else {
        response = await CreateNewChat(formData);
      }

      if (response?.error) {
        console.error("Server error:", response.error);
        alert("مشکلی در ایجاد گروه پیش آمد");
        return;
      }

      console.log("Group created:", response);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("خطایی رخ داد. لطفاً بعداً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="flex flex-row ">
      <div className="flex-[50%]">
        {user.map((u, index) => {
          if (currentUserData?._id === u._id) return null;
          return (
            <div key={index} className="flex gap-2">
              <label className="label">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={userId.includes(u._id)}
                  onChange={() => toggleUserId(u._id)}
                />{" "}
                {u.name}
              </label>
            </div>
          );
        })}
      </div>
      <div className="flex-[50%]">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">Create Group</legend>

          <label className="label mt-2">Group Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <label className="label mt-4">Description</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Group description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mt-6 flex gap-4">
            <button className="btn btn-neutral" onClick={handleSubmit}>
              {initialData ? "updata Group" : "create Group"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setGroupName("");
                setDescription("");
                setUserId([]);
              }}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
