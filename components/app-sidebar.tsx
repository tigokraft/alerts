"use client";

import { useSidebar } from "@/components/SidebarProvider";
import { Home, Bell, Video, PanelLeft, Settings } from "lucide-react";
import { Setting } from "@/components/Setting";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <li>
              <Link href="/control/" passHref>
                <Button variant="ghost" className="w-full flex justify-start space-x-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  {!isCollapsed && <span className="text-sm">Overview</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/control/alerts" passHref>
                <Button variant="ghost" className="w-full flex justify-start space-x-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {!isCollapsed && <span className="text-sm">Alerts</span>}
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/control/videos" passHref>
                <Button variant="ghost" className="w-full flex justify-start space-x-3">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  {!isCollapsed && <span className="text-sm">Videos</span>}
                </Button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Settings */}
        <Button
          variant="ghost"
          className="w-full flex justify-start space-x-3"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </Button>
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
