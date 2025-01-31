import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle GET requests
export async function GET() {
  const alerts = await prisma.alert.findMany();
  return NextResponse.json(alerts);
}

// Handle POST requests
export async function POST(req: Request) {
  const body = await req.json();
  const { name, time, repeat, days, sound } = body;

  const newAlert = await prisma.alert.create({
    data: { name, time, repeat, days, sound, active: true },
  });

  return NextResponse.json(newAlert, { status: 201 });
}

// Handle PATCH requests
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, active } = body;

  const updatedAlert = await prisma.alert.update({
    where: { id: Number(id) },
    data: { active },
  });

  return NextResponse.json(updatedAlert);
}

// Handle DELETE requests
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  await prisma.alert.delete({ where: { id: Number(id) } });
  return NextResponse.json(null, { status: 204 });
}
