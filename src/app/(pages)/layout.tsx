"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sideBar";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
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
  const connected = useSelector(
    (state: RootState) => state.websocket.connected
  );


  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5; // optional limit to retries

    const connect = () => {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

      ws.onopen = () => {
        console.log("socket connected");
        dispatch(setConnected(true));
        reconnectAttempts = 0; // reset attempts on successful connection
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("socket message received:", msg);
        dispatch(addMessage(msg));
      };

      ws.onclose = (event) => {
        console.log("socket closed:", event.reason);
        dispatch(setConnected(false));

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(5000 * (reconnectAttempts + 1), 30000); // exponential backoff up to 30s
          console.log(`attempting to reconnect in ${delay / 1000}s...`);
          reconnectTimer = setTimeout(connect, delay);
          reconnectAttempts++;
        } else {
          console.log("Max reconnect attempts reached. Stopping retries.");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws?.close(); // ensures cleanup
      };

      dispatch(setSocket(ws));
    };

    connect();

    return () => {
      console.log("Cleaning up socket...");
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
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
        <div className="h-full flex w-full">
          {/* side bar */}
          <AppSidebar />

          {/* main window */}
          <div className="w-full h-full flex flex-col max-h-screen overflow-hidden">
            <Navbar />
            <main className="">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </Provider>
  );
}
