"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addMessage, Message } from "@/redux/slices/websocketsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";

interface MessageRequest {
  type: string;
  chatroom_id: string;
  sender_id: string;
  content: string;
}

const MessageBubble = ({
  message,
  recipient,
  user,
}: {
  message: Message;
  recipient: any;
  user: any;
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={
          `flex flex-row` +
          (message.user_id === user.id ? " justify-end" : " justify-start")
        }
      >
        {message.user_id === recipient?.id ? (
          <Avatar className="mr-2 h-8 w-8">
            <AvatarFallback>
              {recipient?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : null}
        <p
          className={
            `flex-1 max-w-[70%]` +
            (message.user_id === user.id
              ? " bg-blue-500 text-white rounded-lg p-2"
              : " bg-gray-200 text-gray-900 rounded-lg p-2")
          }
        >
          {message.content}
        </p>
        {message.user_id === user.id ? (
          <Avatar className="ml-2 h-8 w-8">
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : null}
      </div>
      <div
        className={`w-full flex ${
          message.user_id === user.id ? "justify-end" : "justify-start"
        } text-muted-foreground text-xs mt-1`}
      >
        {new Date(Number(message.created_at) * 1000).toLocaleString()}
      </div>
    </div>
  );
};

const SendMessageBubble = ({
  message,
  user,
  recipient,
  chatroom,
  socket,
}: {
  message: MessageRequest;
  user: RootState["user"];
  recipient: User | undefined;
  chatroom: ChatroomResponse | null;
  socket: WebSocket | null;
}) => {
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();

  const sendMessage = () => {
    const mssg = {
      user_id: user.id,
      receiver_id: recipient?.id,
      content: msg,
      chatroom_id: chatroom?.id || "",
      source: "user",
      created_at: Math.floor(new Date().getTime() / 1000),
    };
    console.log("Sending message:", mssg);
    socket?.send(JSON.stringify(mssg));
    dispatch(addMessage(mssg)); // also show in UI immediately
    setMsg("");
  };
  return (
    <div className="flex w-full gap-2">
      <Input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
};

export default function Chatting({
  oldMessages,
  recipient,
  chatroom,
}: {
  oldMessages: Message[];
  recipient: User | undefined;
  chatroom: ChatroomResponse | null;
}) {
  const [chatMessages, setChatMessages] = useState<Message[]>(oldMessages);
  const user = useSelector((state: RootState) => state.user);
  const { socket, messages } = useSelector(
    (state: RootState) => state.websocket
  );

  useEffect(() => {
    console.log("Updated messages:", messages);
    const relevantMessages = messages.filter(
      (msg) => msg.chatroom_id === chatroom?.id
    );
    setChatMessages([...oldMessages, ...relevantMessages]);
  }, [messages,oldMessages]);

  if (chatMessages.length === 0) {
    return (
      <div className="flex p-4 justify-center items-center h-full">
        <p className="text-muted-foreground">Connect to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 h-full justify-end">
      <div className="mb-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
        {chatMessages.length > 0 && (
          <div>
            {chatMessages.map((message, index) => (
              <div key={`${message.id}-${index}`} className="mb-2 p-2 ">
                <MessageBubble message={message} recipient={recipient} user={user} />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* TODO: Implement sending new messages `*/}
      <SendMessageBubble
        message={{
          type: "",
          chatroom_id: "",
          sender_id: "",
          content: "",
        }}
        user={user}
        recipient={recipient}
        chatroom={chatroom}
        socket={socket}
      />
    </div>
  );
}
