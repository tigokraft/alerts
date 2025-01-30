"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Setting = ({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) => {
  const [theme, setTheme] = useState("system"); // Default theme: "system"

  // Apply the theme on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  // Function to apply the theme
  const applyTheme = (newTheme: string) => {
    document.documentElement.classList.remove("light", "dark");
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", newTheme); // Persist theme
  };

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value);
    applyTheme(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border border-border shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Choose your preferred theme for the application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => handleThemeChange("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => handleThemeChange("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => handleThemeChange("system")}
          >
            System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
