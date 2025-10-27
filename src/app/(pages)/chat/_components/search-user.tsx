import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { Message } from "@/redux/slices/websocketsSlice";

export default function SearchUser({
  recipient,
  setRecipient,
  setOldMessages,
  setChatroom,
}: {
  recipient: User | undefined;
  setRecipient: React.Dispatch<React.SetStateAction<User | undefined>>;
  setOldMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChatroom: React.Dispatch<React.SetStateAction<ChatroomResponse | null>>;
}) {
  const [query, setQuery] = useState("");
  const [showUsersList, setShowUsersList] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<User[] | null>(null);
  const usersListRef = useRef<HTMLDivElement>(null);

  const handleStartChat = async (recipient: User) => {
    setRecipient(recipient);
    const res = await api.get(
      `/chatrooms/find-by-users/user1/${user.id}/user2/${recipient?.id}`
    );
    if (res.status !== 200 || !res.data) {
      toast.error("Error fetching chatroom:", {
        description: JSON.stringify(res),
      });
      return;
    }
    setChatroom(res.data);

    const msgs = await api.get(`/messages/chatroom/${res.data.id}`);
    if (msgs.status === 200) {
      console.log("Fetched messages for chatroom:", msgs.data);
      setOldMessages(msgs.data);
    } else {
      toast.error("Error fetching messages:", {
        description: JSON.stringify(msgs),
      });
    }
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
