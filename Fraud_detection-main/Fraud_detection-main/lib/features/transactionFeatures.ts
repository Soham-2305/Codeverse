// import Transaction from "@/models/Transaction";
// import User from "@/models/User";

// /**
//  * Get transaction history needed for feature engineering
//  */
// export async function getUserTransactionHistory(userId: string) {
//   const now = new Date();

//   const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

//   const [recentTx, allTx, user] = await Promise.all([
//     Transaction.countDocuments({
//       userId,
//       createdAt: { $gte: tenMinutesAgo },
//     }),

//     Transaction.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(50),

//     User.findById(userId),
//   ]);

//   return {
//     recentTxCount: recentTx,
//     transactions: allTx,
//     user,
//   };
// }
import { getUserTransactionHistory } from "./historyQueries";

interface FeatureInput {
  userId: string;
  upiId: string;
  amount: number;
  deviceId?: string;
  ipAddress?: string;
  latitude?: number;
  timestamp?: Date;
}

export async function buildTransactionFeatures(input: FeatureInput) {
  const { userId, upiId, amount, deviceId, ipAddress, latitude } = input;
  const timestamp = input.timestamp || new Date();

  const history = await getUserTransactionHistory(userId);

  // 1️⃣ Amount
  const amount_feature = amount;

  // 2️⃣ Hour of day
  const hour = timestamp.getHours();

  // 3️⃣ Velocity (transactions in last 10 min)
  const velocity_10min = history.recentTxCount;

  // 4️⃣ Average transaction amount
  const avg_amount =
    history.transactions.length > 0
      ? history.transactions.reduce((sum, tx) => sum + tx.amount, 0) /
        history.transactions.length
      : amount;

  // 5️⃣ Account age (days)
  const account_age_days = history.user?.createdAt
    ? Math.floor(
        (Date.now() - new Date(history.user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // 6️⃣ New recipient
  const knownRecipients = new Set(
    history.transactions.map((tx) => tx.upiId)
  );
  const is_new_recipient = knownRecipients.has(upiId) ? 0 : 1;

  // 7️⃣ New device
  const knownDevices = new Set(
    history.transactions.map((tx) => tx.deviceId).filter(Boolean)
  );
  const is_new_device = deviceId && knownDevices.has(deviceId) ? 0 : 1;

  // 8️⃣ New IP
  const knownIps = new Set(
    history.transactions.map((tx) => tx.ipAddress).filter(Boolean)
  );
  const is_new_ip = ipAddress && knownIps.has(ipAddress) ? 0 : 1;

  // 9️⃣ Rural high amount flag
  const is_rural = latitude !== undefined ? latitude < 23.0 : false;
  const rural_high_amount_flag =
    is_rural && amount > 20000 ? 1 : 0;

  return {
    amount: amount_feature,
    hour,
    velocity_10min,
    avg_amount,
    account_age_days,
    is_new_recipient,
    is_new_device,
    is_new_ip,
    rural_high_amount_flag,
  };
}