"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase";
import fetchProfileUrl from "@/utils/fetchProfileURl";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";
import { Spinner } from "@/components/ui/spinner";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [input, setInput] = useState<File | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(
          setUser({
            ...user,
            id: data.id,
            name: data.name,
            email: data.email,
            phone_number: data.phone_number,
            avatar_file_path: data.avatar,
          })
        );
        return;
      }

      if (res.status === 401) {
        return (
          <div className="w-full mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Unauthorized</CardTitle>
                <CardDescription>
                  You are not authorized to view this page. Please log in.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
      }
      if (!res.ok) {
        return (
          <div className="w-full mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Error</CardTitle>
                <CardDescription>
                  Something went wrong. Please try again later.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
      }
    }

    fetchUser();
  }, []);

  const handleAvatarChange = async (file: File) => {
    if (!file) return;
    setLoader(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    let signedUrl = "";

    try {
      if (user.avatar_file_path !== "") {
        const { error: deleteError } = await supabase.storage
          .from("talky-chat")
          .remove([user.avatar_file_path]);
        if (deleteError) {
          console.error("Delete Error:", deleteError.message);
          return;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("talky-chat")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        return;
      }

      await fetchProfileUrl(filePath)
        .then((url) => {
          signedUrl = url;
        })
        .catch((err) => {
          console.error("Error fetching signed URL:", err);
          throw new Error("Failed to fetch signed URL for profile picture");
        });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: filePath }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile picture in backend.");
      }
    } catch (err) {
      toast.error("Error updating profile picture. Please try again.");
      console.error("Error in handleAvatarChange:", err);
      return;
    } finally {
      setLoader(false);
    }
    dispatch(
      setUser({
        ...user,
        avatar_file_path: filePath,
        avatar_url: signedUrl,
      })
    );
    toast.success("Profile picture updated successfully!");
  };

  return (
    <div className="w-full mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        {/* <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            Manage your profile information and settings.
          </CardDescription>
        </CardHeader> */}

        <CardContent>
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage
              src={user.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="object-cover relative"
            />
            <AvatarFallback className="text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>

            <Dialog>
              <DialogTrigger>
                <div
                  className="absolute bg-black/60 inset-0 flex justify-center 
            h-full w-full items-center opacity-0 hover:opacity-100 cursor-pointer transition"
                >
                  <span className="text-white cursor-pointer">Edit Photo</span>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Avatar</DialogTitle>
                  <DialogDescription>
                    Choose a new avatar image to upload.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="avatar" className="sr-only">
                      Upload Avatar
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setInput(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-2">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={loader || !input}
                    className="cursor-pointer"
                    onClick={() => {
                      const input = document.getElementById(
                        "avatar"
                      ) as HTMLInputElement;
                      if (input.files && input.files[0]) {
                        handleAvatarChange(input.files[0]);
                      }
                    }}
                  >
                    {loader ? <Spinner /> : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Avatar>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <Label className="font-semibold mb-3 text-md">Profile Details:</Label>
            <Label className="mb-2 block">
              <span className="font-semibold">User ID:</span> {user.id}
            </Label>
            <Label className="mb-2 block">
              <span className="font-semibold">Email:</span> {user.email}
            </Label>
            <Label className="mb-2 block">
              <span className="font-semibold">Phone number:</span> {user.phone_number}
            </Label>
          </div>
        </CardContent>
        {/* <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
