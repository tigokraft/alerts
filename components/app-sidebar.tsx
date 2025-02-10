"use client";

import React, { useState } from "react";
import { Home, Bell, Video, PanelLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Setting } from "@/components/Setting";
import { NavUser } from "@/components/user-side"; // Adjust the path as necessary

export const AppSidebar = () => {
  // Local state for managing sidebar open vs collapsed
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    console.log("Sidebar is now", !isOpen ? "Open" : "Collapsed");
  };

  // Retrieve session data (if available)
  const { data: session } = useSession();

  return (
    <div className="relative h-screen flex">
      {/* Sidebar container with inline width control */}
      <div
        style={{ width: isOpen ? "16rem" : "4rem" }} // 16rem ~ w-64, 4rem ~ w-16
        className="h-full transition-all duration-300 bg-sidebar text-foreground flex flex-col"
      >
        {/* Navigation items */}
        <nav className="flex-1 space-y-2">
          <ul className="space-y-2 mt-4">
            <li>
              <Link href="/control/" passHref>
                <Button
                  variant="ghost"
                  className="w-full flex justify-start items-center space-x-3 hover-bg"
                >
                  <Home className="h-5 w-5 text-muted-foreground" />
                  {isOpen && <span className="text-sm">Overview</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/control/alerts" passHref>
                <Button
                  variant="ghost"
                  className="w-full flex justify-start items-center space-x-3 hover-bg"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {isOpen && <span className="text-sm">Alerts</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/control/videos" passHref>
                <Button
                  variant="ghost"
                  className="w-full flex justify-start items-center space-x-3 hover-bg"
                >
                  <Video className="h-5 w-5 text-muted-foreground" />
                  {isOpen && <span className="text-sm">Videos</span>}
                </Button>
              </Link>
            </li>
            {/* Render the Admin option only for ADMIN role */}
            {session?.user?.role === "ADMIN" && (
              <li>
                <Link href="/control/admin" passHref>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start items-center space-x-3 hover-bg"
                  >
                    <UserCog className="h-5 w-5 text-muted-foreground" />
                    {isOpen && <span className="text-sm">Admin</span>}
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Conditionally render NavUser only when session.user is available */}
        {isOpen && session?.user && (
          <div className="mt-auto p-4">
            <NavUser user={session.user} />
          </div>
        )}
      </div>

      {/* Toggle sidebar button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-[calc(100%+8px)] flex items-center justify-center text-muted-foreground hover:text-primary"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
    </div>
  );
};
