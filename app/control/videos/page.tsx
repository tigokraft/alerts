"use client";

import { useEffect, useState } from "react";
import VideoUpload from "@/components/VideoUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  filename: string;
  path: string;
  enabled: boolean;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data.videos))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const toggleEnable = async (id: string) => {
    try {
      await fetch(`/api/video/${id}/enable`, { method: "PATCH" });
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v))
      );
    } catch (error) {
      console.error("Failed to toggle video:", error);
    }
  };

  const deleteVideo = async (id: string, filename: string) => {
    try {
      await fetch(`/api/video/${id}/delete`, { method: "DELETE" });
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Videos</h2>

      <VideoUpload onUpload={(video) => setVideos((prev) => [...prev, video])} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4">
              <video src={video.path} className="w-full h-auto" controls />
              <div className="flex justify-between mt-2">
                <Button variant="outline" onClick={() => toggleEnable(video.id)}>
                  {video.enabled ? "Disable" : "Enable"}
                </Button>
                <Button variant="destructive" onClick={() => deleteVideo(video.id, video.filename)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
