import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch the currently enabled video
    const video = await prisma.video.findFirst({
      where: { enabled: true },
    });

    if (!video) {
      return NextResponse.json({ error: "No active video found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Error fetching active video:", error);
    return NextResponse.json({ error: "Failed to fetch active video" }, { status: 500 });
  }
}
