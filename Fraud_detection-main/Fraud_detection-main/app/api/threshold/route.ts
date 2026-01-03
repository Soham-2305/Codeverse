import { NextResponse } from "next/server"
import { setThresholds } from "@/lib/fraud-engine"

export async function POST(req: Request) {
  try {
    const { flag, block } = await req.json()

    if (typeof flag !== "number" || typeof block !== "number") {
      return NextResponse.json({ error: "Invalid thresholds" }, { status: 400 })
    }

    setThresholds(flag, block)

    return NextResponse.json({ success: true, thresholds: { flag, block } })
  } catch (error) {
    console.error("[v0] Error setting thresholds:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
