// /app/api/sounds/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // Await the params before destructuring them.
    const { id } = await context.params;
    const body = await req.json();
    if (typeof body.active !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }
    const updatedSound = await prisma.sound.update({
      where: { id: Number(id) },
      data: { active: body.active },
    });
    return NextResponse.json(updatedSound);
  } catch (error) {
    console.error("Error updating sound:", error);
    return NextResponse.json(
      { error: "Failed to update sound" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    // Await the params before using them.
    const { id } = await context.params;
    await prisma.sound.delete({
      where: { id: Number(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting sound:", error);
    return NextResponse.json(
      { error: "Failed to delete sound" },
      { status: 500 }
    );
  }
}
