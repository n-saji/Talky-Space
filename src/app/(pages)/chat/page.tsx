
import ChatUI from "./chat";

export const metadata = {
  title: "Chat | TalkySpace",
  description: "Chat with your friends and colleagues in real-time.",
};

export default function ChatPage() {


  return (
    <div className="px-4 py-2 w-full h-full">
      <ChatUI />
    </div>
  );
}


