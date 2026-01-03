export interface TransactionInput {
  userId: string
  amount: number
  location: string
  device: string
  merchant: string
  paymentMethod: string
}

export interface FraudResult {
  riskScore: number
  decision: "ALLOW" | "FLAG" | "BLOCK"
  reasons: string[]
}

// Global threshold that can be adjusted
let FRAUD_THRESHOLD = 0.7
let FLAG_THRESHOLD = 0.4

export function setThresholds(flag: number, block: number) {
  FLAG_THRESHOLD = flag
  FRAUD_THRESHOLD = block
}

export function analyzeTransaction(transaction: TransactionInput): FraudResult {
  let riskScore = 0
  const reasons: string[] = []

  // 1. Amount Deviation (+0.3 if > 1000, +0.5 if > 5000)
  if (transaction.amount > 5000) {
    riskScore += 0.5
    reasons.push("Extremely high transaction amount")
  } else if (transaction.amount > 1000) {
    riskScore += 0.3
    reasons.push("Transaction amount significantly above average")
  }

  // 2. Location Analysis (+0.2 if new location)
  const knownLocations = ["New York", "San Francisco", "London", "Tokyo"]
  if (!knownLocations.includes(transaction.location)) {
    riskScore += 0.2
    reasons.push(`Unusual transaction location: ${transaction.location}`)
  }

  // 3. Device Analysis (+0.15 if new device)
  const knownDevices = ["iPhone 15", "MacBook Pro", "Desktop Browser"]
  if (!knownDevices.includes(transaction.device)) {
    riskScore += 0.15
    reasons.push(`Unrecognized device signature: ${transaction.device}`)
  }

  // 4. Merchant Risk (+0.25 for high-risk categories)
  const highRiskMerchants = ["Global Crypto", "Night Casino", "Peer2Peer Transfer"]
  if (highRiskMerchants.includes(transaction.merchant)) {
    riskScore += 0.25
    reasons.push("Transaction with a high-risk merchant category")
  }

  // Normalize risk score between 0 and 1
  riskScore = Math.min(riskScore, 1)

  // Decision Logic based on thresholds
  let decision: "ALLOW" | "FLAG" | "BLOCK" = "ALLOW"
  if (riskScore >= FRAUD_THRESHOLD) {
    decision = "BLOCK"
  } else if (riskScore >= FLAG_THRESHOLD) {
    decision = "FLAG"
  }

  return {
    riskScore,
    decision,
    reasons: reasons.length > 0 ? reasons : ["Transaction follows normal user behavior patterns"],
  }
}
