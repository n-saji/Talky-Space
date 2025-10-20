"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sideBar";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setSocket,
  setConnected,
  addMessage,
} from "../../redux/slices/websocketsSlice";

import Navbar from "./_components/navbar";

function WebSocketManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      dispatch(setConnected(true));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("📩 WebSocket message received:", msg);
      dispatch(addMessage(msg));
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
      dispatch(setConnected(false));
    };

    dispatch(setSocket(ws));

    return () => ws.close();
  }, [dispatch]);

  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <WebSocketManager />
        <div className="min-h-screen flex w-full">
          {/* side bar */}
          <AppSidebar />

          {/* main window */}
          <div className="w-full flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </Provider>
  );
}
