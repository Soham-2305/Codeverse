// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";

// const JWT_SECRET = process.env.JWT_SECRET || "12345";

// // GET - Fetch user profile
// export async function GET(req: NextRequest) {
//   try {
//     const token = req.headers.get("authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded: any = jwt.verify(token, JWT_SECRET);
//     console.log("Decoded token:", decoded);
    
//     await dbConnect();

//     const userId = decoded.userId || decoded.id;
//     const user = await User.findById(userId).select("-passwordHash");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       fullName: user.fullName,
//       email: user.email,
//       profilePhoto: user.profilePhoto,
//       dateOfBirth: user.dateOfBirth,
//       panCardNumber: user.panCardNumber,
//       devices: user.devices,
//     });
//   } catch (error) {
//     console.error("GET Profile error:", error);
//     return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
//   }
// }

// // PUT - Update user profile
// export async function PUT(req: NextRequest) {
//   try {
//     const token = req.headers.get("authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded: any = jwt.verify(token, JWT_SECRET);
//     console.log("🔍 Decoded token:", decoded);
    
//     const body = await req.json();
//     console.log("📦 Request body:", body);
    
//     const { 
//       fullName, 
//       email, 
//       profilePhoto, 
//       dateOfBirth, 
//       panCardNumber,
//       currentPassword, 
//       newPassword 
//     } = body;

//     // Ensure connection is established
//     const connection = await dbConnect();
//     console.log("📡 MongoDB connection state:", connection.connection.readyState);

//     const userId = decoded.userId || decoded.id;
//     console.log("🔑 Looking for user with ID:", userId);
    
//     const user = await User.findById(userId);

//     if (!user) {
//       console.log("❌ User not found with ID:", userId);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     console.log("✅ User found:", user.email);
//     console.log("📝 Before update:", {
//       fullName: user.fullName,
//       email: user.email,
//       profilePhoto: user.profilePhoto,
//       dateOfBirth: user.dateOfBirth,
//       panCardNumber: user.panCardNumber
//     });

//     // Update basic info
//     if (fullName !== undefined) user.fullName = fullName;
//     if (email !== undefined) user.email = email;
//     if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
//     if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
//     if (panCardNumber !== undefined) user.panCardNumber = panCardNumber;

//     console.log("📝 After field updates:", {
//       fullName: user.fullName,
//       email: user.email,
//       profilePhoto: user.profilePhoto,
//       dateOfBirth: user.dateOfBirth,
//       panCardNumber: user.panCardNumber
//     });

//     // Update password if provided
//     if (currentPassword && newPassword) {
//       const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      
//       if (!isMatch) {
//         return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.passwordHash = hashedPassword;
//       console.log("🔐 Password updated");
//     }

//     // Update device info with IP address
//     const ipAddress = req.headers.get("x-forwarded-for") || 
//                       req.headers.get("x-real-ip") || 
//                       "127.0.0.1";
    
//     const deviceId = req.headers.get("user-agent") || "Unknown Device";
    
//     if (!user.devices) {
//       user.devices = [];
//     }
    
//     const existingDevice = user.devices.find((d: any) => d.deviceId === deviceId);
    
//     if (existingDevice) {
//       existingDevice.lastSeenAt = new Date();
//       existingDevice.ipAddress = ipAddress;
//     } else {
//       user.devices.push({
//         deviceId,
//         ipAddress,
//         firstSeenAt: new Date(),
//         lastSeenAt: new Date(),
//       });
//     }

//     user.lastLoginAt = new Date();
    
//     console.log("💾 Attempting to save user...");
//     console.log("🔍 Modified paths:", user.modifiedPaths());
//     console.log("🔍 Is modified:", user.isModified());
    
//     const savedUser = await user.save();
//     console.log("✅ User saved successfully!", savedUser._id);
//     console.log("📝 Saved data:", {
//       fullName: savedUser.fullName,
//       email: savedUser.email,
//       profilePhoto: savedUser.profilePhoto,
//       dateOfBirth: savedUser.dateOfBirth,
//       panCardNumber: savedUser.panCardNumber
//     });

//     return NextResponse.json({ 
//       message: "Profile updated successfully",
//       updated: user.modifiedPaths() // Shows what actually changed
//     });
//   } catch (error) {
//     console.error("❌ Profile update error:", error);
    
//     // Check for validation errors
//     if (error instanceof Error && error.name === 'ValidationError') {
//       console.error("Validation error details:", error.message);
//       return NextResponse.json({ 
//         error: "Validation failed", 
//         details: error.message 
//       }, { status: 400 });
//     }
    
//     return NextResponse.json({ 
//       error: "Failed to update profile", 
//       details: error instanceof Error ? error.message : "Unknown error" 
//     }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { buildTransactionFeatures } from "@/lib/features/transactionFeatures";
import { getMLPrediction } from "@/lib/ml/mlClient";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { userId, upiId, amount, merchant, location, device, paymentMethod } = body;

    if (!userId || !upiId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🧠 Step 1: Feature Engineering
    const features = await buildTransactionFeatures({
      userId,
      upiId,
      amount,
    });

    // 🤖 Step 2: ML Prediction
    const mlResult = await getMLPrediction(features);

    // 🧮 Step 3: Final Risk Score
    const finalRiskScore = Math.round(mlResult.fraud_probability * 100);
    
    // Determine decision based on risk score
    let decision: "ALLOW" | "FLAG" | "BLOCK";
    if (finalRiskScore > 70) {
      decision = "BLOCK";
    } else if (finalRiskScore > 40) {
      decision = "FLAG";
    } else {
      decision = "ALLOW";
    }

    // 💾 Step 4: Save Transaction
    const transaction = await Transaction.create({
      userId,
      upiId,
      amount,
      merchant: merchant || "Unknown",
      location,
      device,
      paymentMethod,

      mlProbability: mlResult.fraud_probability,
      riskScore: finalRiskScore,
      riskLevel: mlResult.risk_level,
      decision,

      featureSnapshot: features,
      status: "SUCCESS",
    });

    return NextResponse.json({
      transactionId: transaction.transactionId,
      status: decision,
      riskScore: mlResult.fraud_probability,
      message: `Transaction ${decision.toLowerCase()}ed`,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Transaction error:", error.message);
    return NextResponse.json(
      { error: "Transaction processing failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch recent transactions
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    const query = userId ? { userId } : {};
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}