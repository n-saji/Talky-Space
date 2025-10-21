"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Message } from "@/redux/slices/websocketsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageRequest {
  type: string;
  chatroom_id: string;
  sender_id: string;
  content: string;
}

const MessageBubble = ({
  message,
  sender,
  user,
}: {
  message: Message;
  sender: any;
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
        {message.user_id === sender?.id ? (
          <Avatar className="mr-2 h-8 w-8">
            <AvatarFallback>
              {sender?.name.charAt(0).toUpperCase()}
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
        {new Date(message.created_at).toLocaleString()}
      </div>
    </div>
  );
};

const SendMessageBubble = ({ message }: { message: MessageRequest }) => {
  return (
    <div className="flex absolute bottom-0 left-0 w-full h-8">
      <Input></Input>
      <Button>Send</Button>
    </div>
  );
};

export default function Chatting({
  oldMessages,
  sender,
}: {
  oldMessages: Message[];
  sender: User | undefined;
}) {
  const user = useSelector((state: RootState) => state.user);
  if (oldMessages.length === 0) {
    return (
      <div className="flex flex-1 p-4 justify-center items-center h-full">
        <p className="text-muted-foreground">Connect to start chatting</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 px-4 max-h-[calc(100vh-4rem)] overflow-scroll relative">
      <div className="flex-1 mb-2 overflow-y-auto">
        {oldMessages.length > 0 && (
          <div>
            {oldMessages.map((message) => (
              <div key={message.id} className="mb-2 p-2 ">
                <MessageBubble message={message} sender={sender} user={user} />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* TODO: Implement sending new messages */}
      <SendMessageBubble
        message={{
          type: "",
          chatroom_id: "",
          sender_id: "",
          content: "",
        }}
      />
    </div>
  );
}
