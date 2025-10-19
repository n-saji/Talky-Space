import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sideBar";

import Navbar from "./_components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
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
  );
}
