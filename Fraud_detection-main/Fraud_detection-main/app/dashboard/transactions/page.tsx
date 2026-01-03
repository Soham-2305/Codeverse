import { TransactionForm } from "@/components/simulator/transaction-form"
import { LiveTable } from "@/components/simulator/live-table"
import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction"

async function getTransactions() {
  await dbConnect()
  return await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()
}

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Transaction Monitoring
      </h2>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <TransactionForm />
        </div>

        <div className="md:col-span-8">
          <LiveTable transactions={transactions} />
        </div>
      </div>
    </div>
  )
}