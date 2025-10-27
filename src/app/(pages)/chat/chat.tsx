"use client";
import { useState } from "react";

import { Message } from "@/redux/slices/websocketsSlice";
import Chatting from "./_components/chatting";
import SearchUser from "./_components/search-user";
import UserHeader from "./_components/user-header";
import { Separator } from "@/components/ui/separator";

export default function ChatUI() {
  const [recipient, setRecipient] = useState<User>();
  const [chatroom, setChatroom] = useState<ChatroomResponse | null>(null);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);

  return (
    <div className="flex w-full h-full">
      <SearchUser
        recipient={recipient}
        setOldMessages={setOldMessages}
        setRecipient={setRecipient}
        setChatroom={setChatroom}
      />
      <Separator orientation="vertical" className="mx-2" />
      <div className="flex flex-col w-full h-full">
        {recipient && <UserHeader recipient={recipient} />}
        <Chatting
          oldMessages={oldMessages}
          recipient={recipient}
          chatroom={chatroom}
        />
      </div>
    </div>
  );
}
