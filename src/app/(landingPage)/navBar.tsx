"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NavBar({ landingPage, isAuthenticated }: { landingPage?: boolean, isAuthenticated: boolean }) {
  const router = useRouter();
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
          {!isAuthenticated && (
            <Button variant={"outline"} onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
          {isAuthenticated && (
            <Button onClick={() => router.push("/setup-profile")}>
              Go to Dashboard
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
