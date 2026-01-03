import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Alert from "@/models/Alert"

export async function GET() {
  try {
    await dbConnect()
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(30)
    return NextResponse.json(alerts)
  } catch (error) {
    console.error("[v0] Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
