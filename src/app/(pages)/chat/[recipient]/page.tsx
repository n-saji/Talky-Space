"use client";
import { useRecipient } from "../RecipientContext";
import Chatting from "./_components/chatting";
import UserHeader from "./_components/user-header";

export default function RecipientChatPage() {
  const { recipient } = useRecipient();
  console.log(`RecipientChatPage recipient: ${recipient?.name}`);
  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full">
        {recipient && <UserHeader recipient={recipient} />}
        <Chatting />
      </div>
    </div>
  );
}
