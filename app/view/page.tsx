"use client";

import { useEffect, useState } from "react";

export default function ViewPage() {
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/video/active")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No active video found");
        }
        return res.json();
      })
      .then((data) => setVideo(data.video?.path || null))
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {video ? (
        <video src={video} autoPlay loop muted className="w-full h-full object-cover" />
      ) : (
        <p className="text-white">No video enabled</p>
      )}
    </div>
  );
}
