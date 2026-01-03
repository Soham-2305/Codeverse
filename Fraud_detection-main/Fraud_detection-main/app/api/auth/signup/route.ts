import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    // 1️⃣ Connect to DB (THIS WAS YOUR MISSING PIECE EARLIER)
    await dbConnect()

    // 2️⃣ Parse request body
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // 3️⃣ Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // 4️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // 5️⃣ Create user
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      accountStatus: "ACTIVE",
      riskScore: 0,
    })

    // 6️⃣ Response (never send passwordHash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
