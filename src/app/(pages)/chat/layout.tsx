"use client";

import { RecipientProvider } from "./RecipientContext";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { clearMessages } from "@/redux/slices/websocketsSlice";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const pathname = usePathname();

  useEffect(() => {
    dispatch(clearMessages());
  }, [pathname]);

  return (
    <RecipientProvider>
      <div className="flex w-full h-full px-4 py-2">{children}</div>
    </RecipientProvider>
  );
}
