"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadSoundDialog() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [soundName, setSoundName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("soundFile", selectedFile);
    formData.append("name", soundName);

    try {
      setUploadStatus("Uploading...");
      const res = await fetch("/api/sounds", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
      setUploadStatus("Upload successful!");
      setSelectedFile(null);
      setSoundName("");
    } catch (error) {
      console.error("Error uploading sound:", error);
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Sound</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle>Upload Sound</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Label htmlFor="soundName">Sound Name</Label>
          <Input
            id="soundName"
            type="text"
            value={soundName}
            onChange={(e) => setSoundName(e.target.value)}
            placeholder="Enter sound name"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="soundFile">Sound File</Label>
          <Input
            id="soundFile"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <Button onClick={handleUpload}>Upload Sound</Button>
        {uploadStatus && <div className="mt-2">{uploadStatus}</div>}
      </DialogContent>
    </Dialog>
  );
}
