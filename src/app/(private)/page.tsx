import { ChatArea } from "@/component/chat_Area/chatArea";
import { Chat } from "@/component/chat_List/chat";
export default function Home() {
  // console.log(current);
  return (
    <div className="flex w-full flex-1 overflow-y-auto  ">
      <Chat />
      <div className="divider divider-horizontal  m-0"></div>

      <ChatArea />
    </div>
  );
}
