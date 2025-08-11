import { messageType, UserType } from "@/interfaces";
import { GetMessagesFromMessageModal } from "@/serverAction/message-ServerAction";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SingleMessage } from "./singleMesage";
import socket from "@/config/socketIO-config";
import { chatState } from "@/redux/chatSlice";

export const Message = () => {
  const [messages, setMessages] = useState<messageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { chat, selectedChat }: chatState = useSelector(
    (state: any) => state.chat
  );

  const { currentUserData } = useSelector((state: any) => state.user);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const processUnreadMessages = async () => {
      // چک‌های امنیتی
      if (!selectedChat?._id || !currentUserData?._id) return;

      const chats = chat.find((c) => c._id === selectedChat._id);

      // چک امن برای وجود chats و unreadCounts
      const unreadMessages = chats?.unreadCounts?.[currentUserData._id] ?? 0;

      // فقط اگه unread message وجود داره، emit کن
      if (unreadMessages > 0) {
        try {
          socket.emit("read-all-messages", {
            chatId: selectedChat._id,
            readByUserId: currentUserData._id,
            users:
              selectedChat.users
                ?.filter((u) => u?._id !== currentUserData._id)
                .map((u) => u?._id) || [],
          });
        } catch (error) {
          console.error("Error emitting read-all-messages:", error);
        }
      }
    };

    processUnreadMessages();
  }, [selectedChat, currentUserData, chat]);

  useEffect(() => {
    const handler = ({
      chatId,
      readByUserId,
    }: {
      chatId: string;
      readByUserId: UserType;
    }) => {
      if (selectedChat?._id !== chatId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender._id !== readByUserId._id &&
          (!Array.isArray(msg.readBy) ||
            !msg.readBy.some((u) => u._id === readByUserId._id))
            ? { ...msg, readBy: [...(msg.readBy || []), readByUserId] }
            : msg
        )
      );
    };

    socket.on("user-read-all-chat-messages", handler);
    return () => {
      socket.off("user-read-all-chat-messages", handler);
    };
  }, [selectedChat]);

  const getAllMessages_from_ServerAction = async () => {
    try {
      setLoading(true);
      if (!selectedChat?._id) {
        return;
      }

      const response = await GetMessagesFromMessageModal(selectedChat?._id);

      if (response?.error) {
        throw new Error(response?.error);
      }
      console.log("Our Messages in PV:", response);
      setMessages(response);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllMessages_from_ServerAction();
  }, [selectedChat]);

  useEffect(() => {
    const handler = (newMessage: messageType) => {
      if (selectedChat?._id === newMessage.chat._id) {
        setMessages((prevMessages) => {
          const exists = prevMessages.some(
            (message) => message.socketMessageId === newMessage.socketMessageId
          );
          if (exists) return prevMessages;
          return [...prevMessages, newMessage];
        });

        socket.emit("read-all-messages", {
          chatId: selectedChat?._id!,
          readByUserId: currentUserData?._id!,
          users: selectedChat?.users
            .filter((u) => u?._id !== currentUserData?._id)
            .map((u) => u?._id),
        });
      }
    };

    socket.on("new-message-received", handler);
    return () => {
      socket.off("new-message-received", handler);
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-scroll">
      {messages.map((message, index) => {
        return <SingleMessage key={index} message={message} />;
      })}
      <div ref={messageEndRef} />
    </div>
  );
};
