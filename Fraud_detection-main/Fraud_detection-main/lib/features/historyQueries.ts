import Transaction from "@/models/Transaction";
import User from "@/models/User";

/**
 * Get transaction history needed for feature engineering
 */
export async function getUserTransactionHistory(userId: string) {
  const now = new Date();

  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  const [recentTx, allTx, user] = await Promise.all([
    Transaction.countDocuments({
      userId,
      createdAt: { $gte: tenMinutesAgo },
    }),

    Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50),

    User.findById(userId),
  ]);

  return {
    recentTxCount: recentTx,
    transactions: allTx,
    user,
  };
}