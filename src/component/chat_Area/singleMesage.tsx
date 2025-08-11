import { messageType } from "@/interfaces";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const SingleMessage = ({ message }: { message: messageType }) => {
  console.log("Single Message:", message);
  const formatDateTime = (date: string) => {
    return dayjs(date).fromNow(); // خروجی مثلا: "2 hours ago"
  };
  const { currentUserData } = useSelector((state: RootState) => state.user);

  const SENDER_IS_ME = currentUserData?._id === message.sender._id;

  return (
    <div
      className={`flex ${SENDER_IS_ME ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-2xl shadow-sm text-sm
          ${
            SENDER_IS_ME
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }
        `}
      >
        {!SENDER_IS_ME && (
          <p className="font-semibold text-xs text-gray-600 mb-1">
            {message.sender.name}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-[16px] font-normal">
          {message.text}
        </p>

        <div className="flex flex-row ">
          <span
            className={`block text-[10px] mt-1 text-right ${
              SENDER_IS_ME ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {formatDateTime(message.createdAt)}
          </span>

          {SENDER_IS_ME && (
            <span className="text-[14px] text-blue-200 ml-2">
              {message.readBy?.some(
                (user) => user._id !== currentUserData?._id
              ) ? (
                <i className="ri-check-double-line"></i>
              ) : (
                <i className="ri-check-line"></i>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
