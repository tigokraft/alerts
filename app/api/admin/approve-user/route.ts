import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { approved: true },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
