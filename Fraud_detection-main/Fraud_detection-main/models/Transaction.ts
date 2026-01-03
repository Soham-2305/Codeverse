// // models/Transaction.ts
// //C:\Users\User\OneDrive\Desktop\New folder\models\User.ts
// import mongoose from "mongoose";

// const TransactionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     upiId: {
//       type: String,
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     // ML outputs
//     mlProbability: Number,
//     riskScore: Number,
//     riskLevel: {
//       type: String,
//       enum: ["LOW", "MEDIUM", "HIGH"],
//     },

//     // Explainability
//     featureSnapshot: Object,

//     status: {
//       type: String,
//       enum: ["SUCCESS", "FAILED", "BLOCKED"],
//       default: "SUCCESS",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Transaction ||
//   mongoose.model("Transaction", TransactionSchema);

// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
    },

    // Fraud / ML relevant fields
    accountStatus: {   
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    lastLoginAt: Date,

    devices: [
      {
        deviceId: String,
        firstSeenAt: Date,
        lastSeenAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);