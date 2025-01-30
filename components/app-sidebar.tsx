"use client";

import { useSidebar } from "@/components/SidebarProvider";
import { Home, Bell, Video, PanelLeft, Settings } from "lucide-react";
import { Setting } from "@/components/Setting";
import { useState } from "react";
import Link from "next/link";

export const AppSidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative h-screen flex">
      {/* Sidebar */}
      <div
        className={`h-full ${
          isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 bg-sidebar text-foreground flex flex-col`}
      >
        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <ul className="space-y-2 mt-4">
            <li
              className={`flex items-center px-4 py-3 ${
                isCollapsed ? "justify-center" : "space-x-3"
              } rounded-lg hover:bg-sidebar-hover cursor-pointer`}
            >
              <Home className="h-5 w-5 text-muted-foreground" />
              {!isCollapsed && <span className="text-sm">Overview</span>}
            </li>
            <li
              className={`flex items-center px-4 py-3 ${
                isCollapsed ? "justify-center" : "space-x-3"
              } rounded-lg hover:bg-sidebar-hover cursor-pointer`}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {!isCollapsed && <span className="text-sm">Alerts</span>}
            </li>
            <li
              className={`flex items-center px-4 py-3 ${
                isCollapsed ? "justify-center" : "space-x-3"
              } rounded-lg hover:bg-sidebar-hover cursor-pointer`}
            >
              <Video className="h-5 w-5 text-muted-foreground" />
              {!isCollapsed && <span className="text-sm">Videos</span>}
            </li>
          </ul>
        </nav>

        {/* Settings */}
        <button
          className={`flex items-center px-4 py-3 ${
            isCollapsed ? "justify-center" : "space-x-3"
          } hover:bg-sidebar-hover rounded-md`}
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>

      {/* Settings Dialog */}
      <Setting open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      {/* Minimize Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-[calc(100%+8px)] flex items-center justify-center text-muted-foreground hover:text-primary"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
    </div>
  );
};
