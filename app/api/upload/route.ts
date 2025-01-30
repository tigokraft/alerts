import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const filePath = join(process.cwd(), "public/videos", filename);

    await writeFile(filePath, buffer);

    // Save to the database
    const video = await prisma.video.create({
      data: {
        filename,
        path: `/videos/${filename}`,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
