import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sideBar";

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
          <SidebarTrigger />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
