// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"

// import dbConnect from "@/lib/db"
// import User from "@/models/User"

// export async function POST(req: Request) {
//   try {
//     // 1️⃣ Connect to DB (THIS WAS YOUR MISSING PIECE EARLIER)
//     await dbConnect()

//     // 2️⃣ Parse request body
//     const { email, password, fullName } = await req.json()

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       )
//     }

//     // 3️⃣ Check if user already exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       )
//     }

//     // 4️⃣ Hash password
//     const passwordHash = await bcrypt.hash(password, 12)

//     // 5️⃣ Create user
//     const user = await User.create({
//       email,
//       passwordHash,
//       fullName,
//       accountStatus: "ACTIVE",
//       riskScore: 0,
//     })

//     // 6️⃣ Response (never send passwordHash)
//     return NextResponse.json(
//       {
//         success: true,
//         user: {
//           id: user._id,
//           email: user.email,
//           fullName: user.fullName,
//         },
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error("Signup error:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log("✅ Database connected for signup");

    const { email, password, fullName } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      accountStatus: "ACTIVE",
      riskScore: 0,
      devices: [],
    });

    console.log("✅ User created:", user._id);

    return NextResponse.json({ 
      success: true,
      message: "User created successfully",
      userId: user._id 
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ 
      error: "Failed to create user",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}