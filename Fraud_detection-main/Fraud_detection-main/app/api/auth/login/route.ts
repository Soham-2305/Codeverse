import dbConnect from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  await dbConnect()   // 🔥 THIS LINE WAS MISSING

  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return Response.json({ error: "Invalid password" }, { status: 401 })
  }

  return Response.json({ success: true })
}
