// import dbConnect from "@/lib/db"
// import User from "@/models/User"
// import bcrypt from "bcryptjs"

// export async function POST(req: Request) {
//   await dbConnect()   // 🔥 THIS LINE WAS MISSING

//   const { email, password } = await req.json()

//   const user = await User.findOne({ email })
//   if (!user) {
//     return Response.json({ error: "User not found" }, { status: 404 })
//   }

//   const isValid = await bcrypt.compare(password, user.passwordHash)
//   if (!isValid) {
//     return Response.json({ error: "Invalid password" }, { status: 401 })
//   }

//   return Response.json({ success: true })
// }

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "12345";

// export async function POST(req: Request) {
//   await dbConnect();

//   const { email, password } = await req.json();

//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   const isValid = await bcrypt.compare(password, user.passwordHash);
//   if (!isValid) {
//     return NextResponse.json({ error: "Invalid password" }, { status: 401 });
//   }

//   // Create JWT token
//   const token = jwt.sign(
//     { 
//       userId: user._id.toString(),
//       email: user.email 
//     },
//     JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   // Update last login
//   user.lastLoginAt = new Date();
//   await user.save();

//   return NextResponse.json({ 
//     success: true,
//     token: token,
//     user: {
//       id: user._id,
//       email: user.email,
//       fullName: user.fullName
//     }
//   });
// }

// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "12345";

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log("✅ Database connected for login");

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ User found:", user._id);

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      console.log("❌ Invalid password for:", email);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    console.log("✅ Login successful for:", email);

    return NextResponse.json({ 
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json({ 
      error: "Login failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}