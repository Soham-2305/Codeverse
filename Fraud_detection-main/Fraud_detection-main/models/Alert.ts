import { Schema, model, models } from "mongoose"

const AlertSchema = new Schema({
  transactionId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  reasons: [{ type: String }],
  severity: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
  createdAt: { type: Date, default: Date.now },
})

export default models.Alert || model("Alert", AlertSchema)
