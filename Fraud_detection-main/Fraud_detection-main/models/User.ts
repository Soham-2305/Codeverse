// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     fullName: {
//       type: String,
//     },

//     // Fraud / ML relevant fields
//     accountStatus: {   
//       type: String,
//       enum: ["ACTIVE", "SUSPENDED"],
//       default: "ACTIVE",
//     },

//     riskScore: {
//       type: Number,
//       default: 0,
//     },

//     lastLoginAt: Date,

//     devices: [
//       {
//         deviceId: String,
//         firstSeenAt: Date,
//         lastSeenAt: Date,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User ||
//   mongoose.model("User", UserSchema);

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

    // New profile fields
    profilePhoto: {
      type: String, // Base64 or URL
    },

    dateOfBirth: {
      type: Date,
    },

    panCardNumber: {
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
        ipAddress: String, // Device IP
        firstSeenAt: Date,
        lastSeenAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);