"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NavBar({ landingPage }: { landingPage?: boolean }) {
  const router = useRouter();
  const cookies = document.cookie;
  const isLoggedIn = cookies.includes("access_token");
  return (
    <div
      className={`w-full h-16 flex items-center justify-between px-8 ${
        landingPage ? "border-bottom" : ""
      }`}
    >
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => router.push("/")}
      >
        TalkySpace
      </div>
      {landingPage && (
        <div className="flex">
          {!isLoggedIn && (
            <Button variant={"outline"} onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
          {isLoggedIn && (
            <Button onClick={() => router.push("/setup-profile")}>
              Go to Dashboard
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
