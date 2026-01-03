import { TransactionForm } from "@/components/simulator/transaction-form"
import { LiveTable } from "@/components/simulator/live-table"
import { SearchToolbar } from "@/components/simulator/search-toolbar" // Import the new component
import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction"

// Modified to accept search parameters
async function getTransactions(searchParams: { q?: string; min?: string; max?: string }) {
  await dbConnect()

  // 1. Build the dynamic filter object
  const filter: any = {}

  // Text Search (searches 'merchant' OR 'upiId')
  if (searchParams.q) {
    const regex = new RegExp(searchParams.q, 'i') // 'i' = case insensitive
    filter.$or = [
      { merchant: { $regex: regex } },
      { upiId: { $regex: regex } }
    ]
  }

  // Price Range Filter
  if (searchParams.min || searchParams.max) {
    filter.amount = {}
    if (searchParams.min) filter.amount.$gte = parseFloat(searchParams.min)
    if (searchParams.max) filter.amount.$lte = parseFloat(searchParams.max)
  }

  // 2. Fetch with filter
  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(50) // Increased limit slightly for search results
    .lean()

  // 3. Serialize for Next.js
  return JSON.parse(JSON.stringify(transactions))
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { q?: string; min?: string; max?: string }
}) {
  // Await searchParams in Next.js 15+ (if you are on older version, remove 'await')
  const params = await searchParams; 
  const transactions = await getTransactions(params)

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1e2746]">Transaction Monitoring</h2>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* --- SECTION 1: SIMULATOR FORM --- */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Simulate Transaction</h3>
            <p className="text-sm text-gray-500">
              Enter transaction details below to test the fraud engine.
            </p>
          </div>
          <TransactionForm />
        </div>

        {/* --- SECTION 2: SEARCH & LIVE TABLE --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
          </div>

          {/* Add the Search Toolbar here */}
          <SearchToolbar />

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {transactions.length > 0 ? (
                <LiveTable transactions={transactions} />
            ) : (
                <div className="p-8 text-center text-gray-500">
                    No transactions found matching your filters.
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}