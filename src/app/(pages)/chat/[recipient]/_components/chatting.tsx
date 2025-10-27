"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addMessage, Message } from "@/redux/slices/websocketsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecipient } from "../../RecipientContext";
import { useParams } from "next/navigation";
import { HandleStartChat } from "../../_components/search-user";

const MessageBubble = ({
  message,
  recipient,
  user,
}: {
  message: Message;
  recipient: User | null;
  user: RootState["user"];
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

const ChatMessages = ({
  chatMessages,
  recipient,
  user,
}: {
  chatMessages: Message[];
  recipient: User | null;
  user: RootState["user"];
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="mb-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {chatMessages.length > 0 && (
        <>
          {chatMessages.map((message, index) => (
            <div key={`${message.id}-${index}`} className="mb-2 p-2">
              <MessageBubble
                message={message}
                recipient={recipient}
                user={user}
              />
            </div>
          ))}
          {/* 👇 dummy div to scroll into view */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

const SendMessageInput = ({
  user,
  recipient,
  chatroom,
  socket,
}: {
  user: RootState["user"];
  recipient: User | null;
  chatroom: ChatroomResponse | null;
  socket: WebSocket | null;
}) => {
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();

  const sendMessage = useCallback(() => {
    if (!msg.trim()) return;
    const mssg = {
      user_id: user.id,
      receiver_id: recipient?.id,
      content: msg,
      chatroom_id: chatroom?.id || "",
      source: "user",
      created_at: Math.floor(Date.now() / 1000),
    };
    console.log("Sending message:", mssg);
    socket?.send(JSON.stringify(mssg));
    dispatch(addMessage(mssg));
    setMsg("");
  }, [msg, user, recipient, chatroom, socket, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        sendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sendMessage]);

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


export default function Chatting() {
  const { recipient, chatroom, serverMessages, setRecipient, setChatroom } =
    useRecipient();
  const [chatMessages, setChatMessages] = useState<Message[]>(
    serverMessages || []
  );

  const user = useSelector((state: RootState) => state.user);
  const { socket, messages } = useSelector(
    (state: RootState) => state.websocket
  );

  // fallback if user refreshes the page
  const params = useParams();
  useEffect(() => {
    if (!recipient) {
      const url_recipient_id = params.recipient || "";
      console.log(
        `Chatting useEffect fetching recipient for id: ${url_recipient_id}`
      );
      setRecipient({
        id: String(url_recipient_id),
        name: "",
      } as User);
      // Fetch recipient details based on params.recipient
      HandleStartChat({
        user_id: user.id || "",
        recipient_id: String(url_recipient_id) || "",
      }).then(({ chatroom_response, messages }) => {
        if (chatroom_response) {
          setChatroom(chatroom_response); // cannot set here as it will cause re-render loop
        }
        if (messages) {
          setChatMessages(messages);
        }
      });
    }
  }, [params.recipient, recipient]);

  useEffect(() => {
    console.log("Updated messages:", messages);
    const relevantMessages = messages.filter(
      (msg) => msg.chatroom_id === chatroom?.id
    );
    setChatMessages([...(serverMessages ?? []), ...relevantMessages]);
  }, [messages, serverMessages]);

  if (chatMessages.length === 0) {
    return (
      <div className="flex p-4 justify-center items-center h-full">
        <p className="text-muted-foreground">Connect to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 h-full justify-end">
      <ChatMessages
        chatMessages={chatMessages}
        recipient={recipient}
        user={user}
      />

      <SendMessageInput
        user={user}
        recipient={recipient}
        chatroom={chatroom}
        socket={socket}
      />
    </div>
  );
}
