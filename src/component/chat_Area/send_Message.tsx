//در سوکت باید کل ابجکت را بفرستیم   دلیلش پایین

// ✅ تفاوت اصلی:
// 🔹 در HTTP:
// یک request می‌زنی به سرور، سرور خودش می‌ره chatId و userId رو بررسی می‌کنه، دیتاهاشو از دیتابیس می‌کشه بیرون.

// یعنی ID بفرستی کافیه چون سرور خودش بقیه‌ی اطلاعات رو داره و واکشی می‌کنه.

// 🔸 در Socket:
// سرور در حالت Real-time فقط رویداد (event) می‌شنوه و معمولاً بدون context هست.

// پس اطلاعاتی مثل chat._id یا sender._id کافی نیست، چون سرور نمی‌تونه خودش بره همه دیتای مربوط رو بگیره.

// Realtime server context-aware نیست، پس اگر شما فقط ID بفرستی، باید سرور خودش بره دنبال اطلاعات و این باعث delay و اضافه شدن منطق بشه.

// ✅ چرا کل آبجکت رو می‌فرستیم؟
// سرعت بالاتر: وقتی کل آبجکت رو بفرستی (مثلاً sender و chat به صورت کامل)، سرور بدون نیاز به درخواست جداگانه به دیتابیس، می‌تونه اون دیتا رو فوراً به دیگران پخش کنه.

// سادگی در پخش به کلاینت‌ها: پیام وقتی به سایر کاربران می‌رسه، نیاز به chat.title یا sender.username دارن، نه فقط ID. اگه این اطلاعات همون لحظه موجود باشه، نمایش سریع‌تر و ساده‌تر میشه.

// اجتناب از فشار بیهوده به دیتابیس: اگه فقط ID بدی، سرور مجبور میشه برای هر پیام realtime یه درخواست به DB بزنه (مثلاً getChatById یا getUserById)، که باعث افزایش load می‌شه.

// ✍️ پس نتیجه:

// // برای socket:
// const socketPayload = {
//   text: message,
//   image: "",
//   chat: selectedChat, // شامل _id، title و ...
//   sender: currentUserData, // شامل _id، name و ...
// };
// socket.emit("send-new-message", socketPayload);

// // برای HTTP:
// const payload = {
//   text: message,
//   image: "",
//   chat: selectedChat._id,
//   sender: currentUserData._id,
// };
// await sendNewMessage(payload);
// درواقع، socket مثل یک «پستچی سریع» عمل می‌کنه که باید خودش همه چیزو با خودش ببره. اما HTTP مثل «سفارش‌دهنده» است که فقط می‌گه فلان آی‌دی رو بده، بقیه رو خودت بفهم.

"use client";
import socket from "@/config/socketIO-config";
import { RootState } from "@/redux/store";
import { sendNewMessage } from "@/serverAction/message-ServerAction";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { read } from "fs";

export const Send_Message = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const emojiRef = useRef<HTMLDivElement>(null);

  const currentUserData = useSelector(
    (state: RootState) => state.user.currentUserData
  );
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );

  useEffect(() => {
    socket.emit("typing", { selectedChat, currentUserData });
  }, [message, selectedChat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const onSendMessage = async () => {
    if (!message.trim() || !selectedChat || !currentUserData) return;

    try {
      const socketPayload = {
        text: message,
        image: "",
        chat: selectedChat,
        sender: currentUserData,
        socketMessageId: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 11)}`,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        // readBy: [],
      };

      socket.emit("send-new-message", socketPayload);
      setMessage("");

      const apiPayload = {
        chat: selectedChat?._id,
        sender: currentUserData?._id,
        text: message,
        image: "",
        readBy: [],
      };

      const result = await sendNewMessage(apiPayload);
      if (result.success) {
        setMessage("");
      }
    } catch (error) {
      console.error("Sending message failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSendMessage();
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
    // setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center justify-between gap-x-3 py-1.5 bg-[#d7d7d724] rounded-xs">
      <div className="relative" ref={emojiRef}>
        <i
          className="ri-emoji-sticker-line text-3xl text-[#0c0618] cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        ></i>
        {showEmojiPicker && (
          <div className="absolute bottom-10 left-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} locale="en" />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center justify-between gap-x-3 overflow-hidden"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type here"
          className="flex-1 input focus:border-none"
        />
        <button type="submit" className="btn btn-neutral">
          Send
        </button>
      </form>
    </div>
  );
};
