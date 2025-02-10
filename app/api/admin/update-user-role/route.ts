// app/api/admin/update-user-role/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const { id, role } = await req.json()
    if (!id || !role) {
      return NextResponse.json({ error: "Missing id or role" }, { status: 400 })
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    })
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
