import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Retrieve alerts including their associated sound data.
    const alerts = await prisma.alert.findMany({
      include: { sound: true },
    });
    return new NextResponse(JSON.stringify(alerts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch alerts" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { name, time, repeat, days, soundId } = body;
    if (!name || !time || !repeat) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert days array into a comma-separated string if needed.
    const daysString = Array.isArray(days) ? days.join(",") : days;

    // Prepare the data for alert creation.
    const data: any = {
      name,
      time,
      repeat,
      days: daysString,
      active: true,
    };

    // If a soundId is provided, connect the alert to the sound.
    if (soundId) {
      data.sound = { connect: { id: Number(soundId) } };
    }

    const newAlert = await prisma.alert.create({
      data,
      include: { sound: true },
    });

    return new NextResponse(JSON.stringify(newAlert), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create alert" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Expecting at least { id, active }.
    const { id, active, soundId } = body;
    if (!id || typeof active !== "boolean") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: any = { active };

    // Update the sound relation if a soundId is provided.
    if (soundId !== undefined) {
      if (soundId === null) {
        data.sound = { disconnect: true };
      } else {
        data.sound = { connect: { id: Number(soundId) } };
      }
    }

    const updatedAlert = await prisma.alert.update({
      where: { id: Number(id) },
      data,
      include: { sound: true },
    });
    return new NextResponse(JSON.stringify(updatedAlert), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating alert:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update alert" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { id } = body;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Missing alert id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await prisma.alert.delete({
      where: { id: Number(id) },
    });
    // Return a 204 No Content response.
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete alert" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
