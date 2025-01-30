import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    const updatedVideo = await prisma.video.update({
      where: { id: params.id },
      data: { enabled: !video.enabled },
    });

    return NextResponse.json({ success: true, video: updatedVideo });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}
