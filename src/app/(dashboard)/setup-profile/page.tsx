import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Setup Profile | TalkySpace",
};

export default async function SetupProfile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get("access_token")?.value;
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookieHeader}`,
    },
    credentials: "include",
  });
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

  const data = await res.json();

  // localStorage.setItem("username",data.name);

  return (
    <div className="w-full mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Complete your profile</CardTitle>
          <CardDescription>
            Please provide the following information to complete your profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage
              src={data.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              className="object-cover relative"
            />
            <AvatarFallback className="text-3xl font-bold">
              {data.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <div className="absolute bg-black/60 inset-0 flex justify-center h-full w-full items-center opacity-0 hover:opacity-100 cursor-pointer transition">
              <span className="text-white cursor-pointer">Add Photo</span>
            </div>
          </Avatar>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">{data.name}</h2>
            <p className="text-muted-foreground">{data.email}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
