// app/api/admin/delete-user/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }
    const deletedUser = await prisma.user.delete({
      where: { id },
    })
    return NextResponse.json(deletedUser, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
