import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Ensure params are resolved before accessing `id`
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    // Find the video in the database
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete the video file from the filesystem
    const filePath = join(process.cwd(), "public", video.path);
    await unlink(filePath).catch(() => console.warn("File not found"));

    // Remove the video record from the database
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
