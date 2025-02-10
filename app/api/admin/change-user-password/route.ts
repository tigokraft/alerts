import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
  try {
    const { id, newPassword } = await req.json()
    if (!id || !newPassword) {
      return NextResponse.json(
        { error: "Missing id or new password" },
        { status: 400 }
      )
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
