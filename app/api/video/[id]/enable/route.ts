import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // Await params to ensure it's resolved before accessing `id`
    const { id } = await context.params;

    // Find the video by ID
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Toggle the `enabled` field
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { enabled: !video.enabled },
    });

    return NextResponse.json({ video: updatedVideo });
  } catch (error) {
    console.error("Error toggling video:", error);
    return NextResponse.json({ error: "Failed to toggle video" }, { status: 500 });
  }
}
