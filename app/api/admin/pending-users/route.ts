import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: { approved: false },
    })
    return NextResponse.json(pendingUsers, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
