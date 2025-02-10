// /app/api/sounds/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sounds = await prisma.sound.findMany();
    return NextResponse.json(sounds);
  } catch (error) {
    console.error("Error fetching sounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch sounds" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Use the built-in FormData API to parse the incoming request.
    const formData = await req.formData();
    const nameField = formData.get("name");
    const fileField = formData.get("soundFile");

    // Validate the file input.
    if (!fileField || !(fileField instanceof Blob)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Determine a sound name: either the provided name or, if fileField is a File, use its name.
    const soundName =
      typeof nameField === "string"
        ? nameField
        : fileField instanceof File
        ? fileField.name
        : "Unnamed";

    // Prepare the upload directory under your public folder.
    const uploadDir = path.join(process.cwd(), "public", "uploads", "sounds");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a unique filename.
    const originalName = fileField instanceof File ? fileField.name : "sound";
    const newFilename = `${Date.now()}-${originalName}`;
    const newFilePath = path.join(uploadDir, newFilename);

    // Convert the Blob (or File) to a Buffer.
    const arrayBuffer = await fileField.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to disk.
    fs.writeFileSync(newFilePath, buffer);

    // Build the file URL (assuming your public folder is served as the root).
    const fileUrl = `/uploads/sounds/${newFilename}`;

    // Create a new sound record in your database.
    const newSound = await prisma.sound.create({
      data: {
        name: soundName,
        fileUrl,
      },
    });

    return NextResponse.json(newSound, { status: 201 });
  } catch (error) {
    console.error("Error uploading sound:", error);
    return NextResponse.json(
      { error: "Failed to upload sound" },
      { status: 500 }
    );
  }
}
