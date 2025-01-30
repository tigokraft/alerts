import { SidebarProvider } from "@/components/SidebarProvider";
import { AppSidebar } from "@/components/app-sidebar";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <SidebarProvider>
          {/* Layout with Sidebar */}
          <div className="flex">
            {/* Sidebar */}
            <AppSidebar />
            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
