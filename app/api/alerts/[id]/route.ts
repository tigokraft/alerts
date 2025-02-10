import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const body = await req.json();

    // Prepare update data and handle the sound relation if provided.
    const data: any = { ...body };
    if ("soundId" in body) {
      if (body.soundId === null) {
        data.sound = { disconnect: true };
      } else {
        data.sound = { connect: { id: Number(body.soundId) } };
      }
      delete data.soundId; // Remove raw soundId after processing.
    }

    const updatedAlert = await prisma.alert.update({
      where: { id: Number(id) },
      data,
      include: { sound: true },
    });
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    await prisma.alert.delete({
      where: { id: Number(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
