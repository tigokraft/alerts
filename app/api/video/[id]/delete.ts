import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const video = await prisma.video.findUnique({ where: { id: params.id } });

    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

    // Delete the video file
    const filePath = join(process.cwd(), "public", video.path);
    await unlink(filePath).catch(() => console.warn("File not found"));

    // Remove from database
    await prisma.video.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
