"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function VideoUpload({ onUpload }: { onUpload: (video: any) => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null); // Reset error

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      onUpload(data.video);
      setFile(null);
      setOpen(false);
    } catch (error: any) {
      console.error("Upload Error:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Video</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
          </DialogHeader>
          <Input type="file" accept="video/*" onChange={handleFileChange} />
          {uploading && <Progress />}
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={handleUpload} disabled={!file || uploading}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
