import { Group_form } from "@/component/group/group_form";
import { UserType } from "@/interfaces";
import userModel from "@/models/userModel";
import Link from "next/link";
import React from "react";

const Create_group = async () => {
  const users: UserType[] = await userModel.find({});
  console.log("user in groups: ", users);
  return (
    <div>
      <Link href={"/"}>Back to main chat</Link>
      <Group_form user={JSON.parse(JSON.stringify(users))} />
    </div>
  );
};

export default Create_group;
