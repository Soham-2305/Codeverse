import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { buildTransactionFeatures } from "@/lib/features/transactionFeatures";
import { getMLPrediction } from "@/lib/ml/mlClient";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { userId, upiId, amount } = body;

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

    // 🧮 Step 3: Final Risk Score (temporary = ML only)
    const finalRiskScore = Math.round(mlResult.fraud_probability * 100);

    // 💾 Step 4: Save Transaction
    const transaction = await Transaction.create({
      userId,
      upiId,
      amount,

      mlProbability: mlResult.fraud_probability,
      riskScore: finalRiskScore,
      riskLevel: mlResult.risk_level,

      featureSnapshot: features,
      status: "SUCCESS",
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Transaction error:", error.message);
    return NextResponse.json(
      { error: "Transaction processing failed" },
      { status: 500 }
    );
  }
}