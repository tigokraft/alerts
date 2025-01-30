import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const video = await prisma.video.findFirst({ where: { enabled: true } });
    return NextResponse.json({ video });
  } catch (error) {
    return NextResponse.json({ error: "Could not fetch video" }, { status: 500 });
  }
}
