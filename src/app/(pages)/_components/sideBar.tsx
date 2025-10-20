"use client";
import {
  Apple,
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect } from "react";
import fetchProfileUrl from "@/utils/fetchProfileURl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";
import Image from "next/image";
import api from "@/lib/api";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
];

export function AppSidebar() {
  const router = useRouter();
  async function handleLogOut() {
    const res = await api.post("/auth/logout");
    if (res.status === 200) {
      // Clear local storage and redirect to login page
      // localStorage.clear();
      router.push("/login");
    } else {
      toast.error("Error logging out. Please try again.");
    }
  }

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user.avatar_file_path) {
        try {
          const url = await fetchProfileUrl(user.avatar_file_path);
          dispatch(
            setUser({
              ...user,
              avatar_url: url,
            })
          );
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [user.avatar_file_path]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Apple className="mr-2" width={20} height={20} />
                <span>TalkySpace</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mt-auto w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  {/* <Avatar>
                    <AvatarImage
                      src={user.avatar_url}
                      alt="Avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase() || "G"}
                    </AvatarFallback>
                  </Avatar> */}

                  <Image
                    src={user.avatar_url || "/default-avatar.png"}
                    alt="Avatar"
                    width={28}
                    height={28}
                    className="object-cover rounded-full"
                  />

                  {user.name || "Guest"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-64">
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  <span className="flex items-center gap-2">
                    {" "}
                    <User /> Account
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="flex items-center gap-2">
                    {" "}
                    <Settings /> Settings
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // Clear local storage and redirect to login page
                    handleLogOut();
                  }}
                >
                  <span className="flex items-center gap-2">
                    <LogOut /> Sign out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
