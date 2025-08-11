"use client";
import { UserType } from "@/interfaces";
import { setChat } from "@/redux/chatSlice";
import { CreateNewChat, GetAllChats } from "@/serverAction/chat-action";
import { getAllUser } from "@/serverAction/user-action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "@/config/socketIO-config";

export const ChatHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const modalRef = React.useRef<HTMLDialogElement | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserType[]>([]);

  const { currentUserData } = useSelector((state) => state.user);
  const { chat } = useSelector((state) => state.chat);
  console.log("قبلا چت داشتیم باهاشون:", chat);
  const getUser = async () => {
    try {
      setLoading(true);
      const userData = await getAllUser();
      setUser(userData); // Updating state with fetched user data
      setLoading(false);
      console.log("userData", userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const handleModal = () => {
    getUser();
    modalRef.current?.showModal();
  };

  const handleAddChat = async (u: UserType) => {
    if (!currentUserData?._id) return;
    console.log("uuuuuuuuuuu:", u);
    const formData = new FormData();
    formData.append("currentUserId", currentUserData._id);
    formData.append("createdBy", currentUserData._id);
    formData.append("targetUserId", u._id);
    formData.append("isGroupChat", "false");

    const result = await CreateNewChat(formData);
    console.log("resulttttttt:", result);
    console.log("result.success:", result.success);
    if (result.success) {
      // Join both users to the chat room
      socket.emit("join-chat-room", {
        chatId: result.chat._id,
        userIds: [currentUserData._id, u._id],
      });

      const updatedChats = await GetAllChats(currentUserData._id);
      console.log("updatedChats:", updatedChats);
      if (updatedChats) {
        console.log("ابدیتت کننننننننننننن", updatedChats);
        dispatch(setChat(updatedChats));
      }
    }
  };

  return (
    <div className="flex-[20%]">
      <div className="flex flex-col gap-y-2.5">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl">My Chat</h1>
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
              New
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li className="w-full">
                <a onClick={handleModal}>New Chat</a>
              </li>
              <li className="w-full">
                <a onClick={() => router.push("/group/create-group")}>
                  New Group
                </a>
              </li>
            </ul>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search chat"
          className="input focus:outline-none w-[80%] mr-auto "
        />
      </div>

      <dialog ref={modalRef} id="my_modal_2" className="modal">
        <div className="modal-box flex flex-col justify-between ">
          {!loading && user.length > 0 ? (
            <>
              <h3 className="font-bold text-lg text-center">Chat List</h3>
              <div className="flex flex-col gap-2">
                {user.map((u, inx) => {
                  const alreadyExists = chat.find((c) =>
                    c.users.some((usr) => usr._id === u._id)
                  );

                  let isGroupChat = false;
                  if (alreadyExists) {
                    isGroupChat = alreadyExists.isGroupChat; // چون تو مدل چت داری
                  }

                  if (
                    u._id === currentUserData?._id ||
                    (alreadyExists && !isGroupChat)
                  )
                    return null;

                  return (
                    <div
                      key={inx}
                      className="flex gap-2 justify-between items-center"
                    >
                      <div className="flex items-center gap-1">
                        <Image
                          src={"/user.png"}
                          height={32}
                          width={32}
                          alt="pic"
                          className="rounded-full"
                        />
                        <p>{u.name}</p>
                      </div>
                      <button
                        onClick={() => handleAddChat(u)}
                        className="btn btn-outline text-purple-500"
                      >
                        Add to chat
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p>is loading...</p>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
