import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import api from "@/lib/api";
import { toast } from "sonner";

import { useRecipient } from "../RecipientContext";
import { useRouter } from "next/navigation";

import { Message } from "@/redux/slices/websocketsSlice";

export async function FetchMessagesForUser({
  chatroom_id,
}: {
  chatroom_id: string;
}): Promise<Message[] | null> {
  const msgs = await api.get(`/messages/chatroom/${chatroom_id}`);
  if (msgs.status === 200) {
    return msgs.data as Message[];
  } else {
    toast.error("Error fetching messages:", {
      description: JSON.stringify(msgs),
    });
  }
  return null;
}

export async function FetchChatroomBetweenUsers({
  user1_id,
  user2_id,
}: {
  user1_id: string;
  user2_id: string;
}): Promise<ChatroomResponse | null> {
  return api
    .get(`/chatrooms/find-by-users/user1/${user1_id}/user2/${user2_id}`)
    .then((res) => {
      if (res.status === 200) {
        console.log("Fetched chatroom between users:", res.data);
        return res.data;
      } else {
        toast.error("Error fetching chatroom:", {
          description: JSON.stringify(res),
        });
      }
    });
}

export async function HandleStartChat({
  user_id,
  recipient_id,
}: {
  user_id: string;
  recipient_id: string;
}): Promise<{
  chatroom_response: ChatroomResponse | null;
  messages?: Message[];
}> {
  const res = await FetchChatroomBetweenUsers({
    user1_id: user_id,
    user2_id: recipient_id,
  });
  if (!res) {
    console.error("No chatroom found");
    return { chatroom_response: null, messages: [] };
  }

  const msgs = await FetchMessagesForUser({ chatroom_id: res.id });
  if (!msgs) {
    console.error("No messages found");
    return { chatroom_response: res, messages: [] };
  }

  return { chatroom_response: res, messages: msgs };
}

export default function SearchUser({ q }: { q?: string }) {
  const [query, setQuery] = useState(q || "");
  const [showUsersList, setShowUsersList] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<User[] | null>(null);
  const usersListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { setRecipient, setserverMessages, setChatroom } = useRecipient();

  const handleStartChat = async (recipient: User) => {
    setRecipient(recipient);

    const { chatroom_response, messages } = await HandleStartChat({
      user_id: user.id || "",
      recipient_id: recipient.id || "",
    });
    if (chatroom_response) {
      setChatroom(chatroom_response);
    }
    if (messages) {
      setserverMessages(messages);
    }
    router.push(`/chat/${recipient.id}`);
  };

  useEffect(() => {
    const fetchUsers = async (q: string) => {
      if (!q) return setUsers([]);
      const res = await api.get(`/users/look-up?q=${q}`);
      setUsers(res.data);
    };
    fetchUsers(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        usersListRef.current &&
        !usersListRef.current.contains(event.target as Node)
      ) {
        setShowUsersList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [usersListRef]);

  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupInput
          placeholder="Search for people..."
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onFocus={() => setShowUsersList(true)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        {query && (
          <InputGroupAddon align="inline-end">
            {users?.length !== undefined ? `${users?.length}` : 0} results
          </InputGroupAddon>
        )}
      </InputGroup>
      {showUsersList && (
        <ScrollArea className="h-28 mt-2" ref={usersListRef}>
          {users?.map((user) => (
            <Item key={user.id} className="" variant={"outline"}>
              <ItemMedia>
                <Avatar>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent
                onClick={async () => {
                  await handleStartChat(user);
                }}
                className="hover:cursor-pointer"
              >
                <ItemTitle>{user.name}</ItemTitle>
                <ItemDescription>{user.email}</ItemDescription>
                <ItemDescription>{user.phone_number}</ItemDescription>
              </ItemContent>
              {/* <ItemActions>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={async () => {
                    await handleStartChat(user);
                  }}
                >
                  Start Chat
                </Button>
              </ItemActions> */}
            </Item>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
