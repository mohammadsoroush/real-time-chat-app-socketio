import { Group_form } from "@/component/group/group_form";
import { UserType } from "@/interfaces";
import chatModel from "@/models/chatModel";
import userModel from "@/models/userModel";
import Link from "next/link";
import React from "react";

const EditGroup = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const users: UserType[] = await userModel.find();
  const chat = await chatModel.findById(slug);

  return (
    <div className="p-5">
      <Link
        className="text-primary border border-primary px-5 py-2 no-underline border-solid text-sm"
        href="/"
      >
        Back To Chats
      </Link>

      <h1 className="text-primary text-xl font-bold py-2 uppercase">
        Create Group Chat
      </h1>

      <Group_form
        initialData={JSON.parse(JSON.stringify(chat))}
        user={JSON.parse(JSON.stringify(users))}
      />
    </div>
  );
};

export default EditGroup;
