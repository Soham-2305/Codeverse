import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    
    userId: {
      type: String,
      required: true,
      index: true,
    },
    
    upiId: {
      type: String,
      required: true,
    },
    
    amount: {
      type: Number,
      required: true,
    },
    
    mlProbability: {
      type: Number,
      required: true,
    },
    
    riskScore: {
      type: Number,
      required: true,
    },
    
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },
    
    decision: {
      type: String,
      enum: ["ALLOW", "FLAG", "BLOCK"],
      required: true,
    },
    
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
    
    featureSnapshot: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);