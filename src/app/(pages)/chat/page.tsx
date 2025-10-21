"use client";

import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../../../redux/slices/websocketsSlice";
import { Message } from "../../../redux/slices/websocketsSlice";
import { useState } from "react";
import { RootState } from "@/redux/store";
import ChatUI from "./chat";

export default function ChatPage() {
  const { socket, messages } = useSelector((state: any) => state.websocket);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [reciever, setReciever] = useState("");
  const user = useSelector((state: RootState) => state.user);

  const sendMessage = () => {
    const mssg = {
      sender_id: user.id,
      receiver_id: reciever,
      content: msg,
      chatroom_id: "16cd60db-36e9-4344-8a39-6209e13b0d8e",
      source: "user",
      created_at: new Date().toISOString(),
    };

    socket?.send(JSON.stringify(mssg));
    dispatch(addMessage(mssg)); // also show in UI immediately
    setMsg("");
  };

  return (
    <div className="px-4 py-2 flex flex-1 flex-col w-full overflow-scroll scrollbar-hide">
      <ChatUI />
    </div>
  );
}
