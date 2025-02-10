"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactDOM from "react-dom";
import { Button } from "@/components/ui/button";

interface SettingProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const Setting = ({ open, onOpenChange }: SettingProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("system");

  useEffect(() => {
    // On mount (or when the theme changes), sync the local state with the active theme.
    setSelectedTheme(theme || "system");
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  // If the dialog is closed, render nothing.
  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 rounded shadow-lg max-w-md w-full bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]"
      >
        <h2 className="text-lg font-bold mb-4">Theme Settings</h2>
        <p className="mb-4 text-sm">
          Current theme: <strong>{selectedTheme}</strong>
        </p>
        <div className="flex justify-between mb-4">
          <Button
            variant={selectedTheme === "light" ? "default" : "outline"}
            onClick={() => handleThemeChange("light")}
          >
            Light
          </Button>
          <Button
            variant={selectedTheme === "dark" ? "default" : "outline"}
            onClick={() => handleThemeChange("dark")}
          >
            Dark
          </Button>
          <Button
            variant={selectedTheme === "system" ? "default" : "outline"}
            onClick={() => handleThemeChange("system")}
          >
            System
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
