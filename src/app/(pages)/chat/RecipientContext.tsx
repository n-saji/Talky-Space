"use client";

import { Message } from "@/redux/slices/websocketsSlice";
import { createContext, useContext, useState, ReactNode } from "react";

type RecipientContextType = {
  recipient: User | null;
  setRecipient: (recipient: User | null) => void;
  serverMessages: Message[] | null;
  setserverMessages: (serverMessages: Message[] | null) => void;
  chatroom: ChatroomResponse | null;
  setChatroom: (chatroom: ChatroomResponse | null) => void;
};

// Create context
const RecipientContext = createContext<RecipientContextType | undefined>(
  undefined
);

// Provider component
export const RecipientProvider = ({ children }: { children: ReactNode }) => {
  const [recipient, setRecipient] = useState<User | null>(null);
  const [serverMessages, setserverMessages] = useState<Message[] | null>(null);
  const [chatroom, setChatroom] = useState<ChatroomResponse | null>(null);

  return (
    <RecipientContext.Provider
      value={{
        recipient,
        setRecipient,
        serverMessages,
        setserverMessages,
        chatroom,
        setChatroom,
      }}
    >
      {children}
    </RecipientContext.Provider>
  );
};

// Custom hook (optional, for easy access)
export const useRecipient = () => {
  const context = useContext(RecipientContext);
  if (!context) {
    throw new Error("useRecipient must be used within a RecipientProvider");
  }
  return context;
};
