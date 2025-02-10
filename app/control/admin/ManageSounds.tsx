"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Sound {
  id: number;
  name: string;
  fileUrl: string;
  active: boolean;
}

export default function ManageSounds() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchSounds();
  }, []);

  async function fetchSounds() {
    try {
      const res = await fetch("/api/sounds");
      const data = await res.json();
      setSounds(data);
    } catch (error) {
      console.error("Error fetching sounds:", error);
    }
  }

  async function deleteSound(id: number) {
    try {
      const res = await fetch(`/api/sounds/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStatusMessage("Sound deleted successfully.");
        fetchSounds();
      } else {
        setStatusMessage("Failed to delete sound.");
      }
    } catch (error) {
      console.error("Error deleting sound:", error);
      setStatusMessage("Error deleting sound.");
    }
  }

  async function toggleSoundActive(sound: Sound) {
    try {
      // Toggle the active state
      const res = await fetch(`/api/sounds/${sound.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !sound.active }),
      });
      if (res.ok) {
        setStatusMessage("Sound status updated.");
        fetchSounds();
      } else {
        setStatusMessage("Failed to update sound status.");
      }
    } catch (error) {
      console.error("Error updating sound status:", error);
      setStatusMessage("Error updating sound status.");
    }
  }

  return (
    <div className="mt-6 p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Manage Sounds</h2>
      {statusMessage && <div className="mb-2 text-sm">{statusMessage}</div>}
      {sounds.length === 0 ? (
        <p>No sounds available.</p>
      ) : (
        <ul className="space-y-2">
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>
                <div className="font-semibold">{sound.name}</div>
                <div className="text-xs text-gray-600">{sound.fileUrl}</div>
                <div className="text-xs">
                  Status: {sound.active ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleSoundActive(sound)}
                >
                  {sound.active ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteSound(sound.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
