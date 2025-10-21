import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { addMessage, Message } from "@/redux/slices/websocketsSlice";
import Chatting from "./_components/chatting";

export default function ChatUI() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[] | null>(null);
  const [sender, setSender] = useState<User>();
  const user = useSelector((state: RootState) => state.user);
  const [chatroom, setChatroom] = useState<ChatroomResponse | null>(null);
  const messages = useSelector((state: RootState) => state.websocket.messages);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const dispatch = useDispatch();
  const usersListRef = useRef<HTMLDivElement>(null);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    const fetchUsers = async (q: string) => {
      if (!q) return setUsers([]);
      const res = await api.get(`/users/look-up?q=${q}`);
      setUsers(res.data);
    };
    fetchUsers(query);
  }, [query]);

  const handleStartChat = async (sender: User) => {
    setSender(sender);
    const res = await api.get(
      `/chatrooms/find-by-users/user1/${user.id}/user2/${sender?.id}`
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
      // msgs.data.forEach((m: Message) => {
      //   console.log("Dispatching message:", m);
      //   dispatch(addMessage(m));
      // });
    } else {
      toast.error("Error fetching messages:", {
        description: JSON.stringify(msgs),
      });
    }
  };

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
    <div className="flex w-full h-full overflow-scroll">
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
                <ItemContent>
                  <ItemTitle>{user.name}</ItemTitle>
                  <ItemDescription>{user.email}</ItemDescription>
                  <ItemDescription>{user.phone_number}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={async () => {
                      await handleStartChat(user);
                    }}
                  >
                    Start Chat
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ScrollArea>
        )}
      </div>
      {/* <div className="max-h-[300px] overflow-scroll">
        {oldMessages.length > 0 && (
          <div>
            {oldMessages.map((message) => (
              <div key={message.id} className="mb-2 p-2 ">
                <div
                  className={
                    `flex flex-row` +
                    (message.user_id === user.id
                      ? " justify-end"
                      : " justify-start")
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
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <Chatting oldMessages={oldMessages} sender={sender} />
    </div>
  );
}
