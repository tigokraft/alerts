// app/control/layout.tsx

import { AppSidebar, } from "@/components/app-sidebar";
import { Providers } from "../providers"; // adjust path if needed
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  charset: "utf-8",
  title: "control panel",
  description: "video alerter",
};

export default function ControlLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <Providers>
          <div className="flex">
            {/* Sidebar */}
            <AppSidebar />
            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </SidebarProvider>
    </>
  );
}
