import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with default role (CONTROLER) and approved set to false
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // approved is false by default via schema; you can also explicitly do:
        // approved: false,
      },
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 })
  }
}
