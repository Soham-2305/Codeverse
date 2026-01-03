// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import Transaction from "@/models/Transaction";
// import { buildTransactionFeatures } from "@/lib/features/transactionFeatures";
// import { getMLPrediction } from "@/lib/ml/mlClient";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const body = await req.json();

//     const { userId, upiId, amount } = body;

//     if (!userId || !upiId || !amount) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // 🧠 Step 1: Feature Engineering
//     const features = await buildTransactionFeatures({
//       userId,
//       upiId,
//       amount,
//     });

//     // 🤖 Step 2: ML Prediction
//     const mlResult = await getMLPrediction(features);

//     // 🧮 Step 3: Final Risk Score (temporary = ML only)
//     const finalRiskScore = Math.round(mlResult.fraud_probability * 100);

//     // 💾 Step 4: Save Transaction
//     const transaction = await Transaction.create({
//       userId,
//       upiId,
//       amount,

//       mlProbability: mlResult.fraud_probability,
//       riskScore: finalRiskScore,
//       riskLevel: mlResult.risk_level,

//       featureSnapshot: features,
//       status: "SUCCESS",
//     });

//     return NextResponse.json(transaction, { status: 201 });
//   } catch (error: any) {
//     console.error("Transaction error:", error.message);
//     return NextResponse.json(
//       { error: "Transaction processing failed" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { buildTransactionFeatures } from "@/lib/features/transactionFeatures";
import { getMLPrediction } from "@/lib/ml/mlClient";

const JWT_SECRET = process.env.JWT_SECRET || "12345";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Step 1: Authenticate user
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token - no user ID" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    console.log("📦 Request body:", body);
    console.log("👤 User ID from token:", userId);

    const { upiId, amount } = body;

    if (!upiId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: upiId and amount" },
        { status: 400 }
      );
    }

    // 🧠 Step 2: Feature Engineering
    const features = await buildTransactionFeatures({
      userId,
      upiId,
      amount,
    });

    // 🤖 Step 3: ML Prediction
    const mlResult = await getMLPrediction(features);

    // 🧮 Step 4: Final Risk Score
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

    // 💾 Step 5: Save Transaction
    const transaction = await Transaction.create({
      userId,
      upiId,
      amount,

      mlProbability: mlResult.fraud_probability,
      riskScore: finalRiskScore,
      riskLevel: mlResult.risk_level,
      decision,

      featureSnapshot: features,
      status: "SUCCESS",
    });

    console.log("✅ Transaction created:", transaction.transactionId);

    return NextResponse.json({
      transactionId: transaction.transactionId,
      status: decision,
      riskScore: finalRiskScore,
      riskLevel: mlResult.risk_level,
      message: `Transaction ${decision.toLowerCase()}ed`,
    }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Transaction error:", error.message);
    return NextResponse.json(
      { error: "Transaction processing failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch transactions for logged-in user
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    await dbConnect();
    
    const transactions = await Transaction.find({ userId })
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