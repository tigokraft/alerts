"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Ref to store the alarm audio instance.
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");
  // State to store the current time as "HH:MM"
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );

  // Update currentTime every second.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll the active video every 5 seconds.
  const { data: videoData, error: videoError } = useSWR(
    "/api/video/active",
    fetcher,
    { refreshInterval: 5000 }
  );
  const videoPath = videoData?.video?.path || null;

  // Poll alerts every second.
  const { data: alerts, error: alertsError } = useSWR("/api/alerts", fetcher, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (alerts && Array.isArray(alerts)) {
      // Check for an active alert matching the current time.
      const triggeredAlert = alerts.find(
        (alert: any) => alert.active && alert.time === currentTime
      );
      
      if (triggeredAlert) {
        // Pause the video if it is playing.
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
        setOverlayMessage(triggeredAlert.name);
        setOverlayVisible(true);

        // Start the alarm sound (looping) if available and not already playing.
        if (
          triggeredAlert.sound &&
          triggeredAlert.sound.fileUrl &&
          !alarmAudioRef.current
        ) {
          const audio = new Audio(triggeredAlert.sound.fileUrl);
          audio.loop = true;
          alarmAudioRef.current = audio;
          audio.play().catch((error) =>
            console.error("Error playing alarm sound:", error)
          );
        }
        
        // After 20 seconds, hide the overlay and stop the alarm.
        const timer = setTimeout(() => {
          setOverlayVisible(false);
          if (alarmAudioRef.current) {
            alarmAudioRef.current.pause();
            alarmAudioRef.current.currentTime = 0;
            alarmAudioRef.current = null;
          }
        }, 20000);
        
        return () => clearTimeout(timer);
      } else {
        // If no alert is triggered, resume video playback if paused.
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
  }, [alerts, currentTime]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center relative">
      {videoPath ? (
        <video
          ref={videoRef}
          src={videoPath}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <p className="text-white">No video enabled</p>
      )}
      {(videoError || alertsError) && (
        <p className="text-red-500 absolute top-4">Error loading data.</p>
      )}
      {/* Full-screen overlay for the alert */}
      {overlayVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-9xl p-4">{overlayMessage}</div>
        </div>
      )}
    </div>
  );
}
