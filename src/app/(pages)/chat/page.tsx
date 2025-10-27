import Chat from "./chat";

export const metadata = {
  title: "Chat | TalkySpace",
  description: "Chat with your friends and colleagues in real-time.",
};

export default function ChatPage() {
  return (
    <div className="w-full h-full">
      <Chat />
    </div>
  );
}
