import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction"
import { ArrowLeft, ShieldAlert, ShieldCheck, MapPin, Smartphone, CreditCard, Building2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getTransaction(id: string) {
  await dbConnect()
  return await Transaction.findOne({ transactionId: id }).lean()
}

export default async function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const transaction = await getTransaction(params.id)

  if (!transaction) {
    notFound()
  }

  const isRisk = transaction.decision !== "ALLOW"

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Transaction Detail</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Core Details</CardTitle>
              <Badge
                variant={
                  transaction.decision === "BLOCK"
                    ? "destructive"
                    : transaction.decision === "FLAG"
                      ? "secondary"
                      : "default"
                }
                className="text-sm px-4 py-1"
              >
                {transaction.decision}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Merchant</p>
                  <p className="font-semibold">{transaction.merchant}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Method</p>
                  <p className="font-semibold">{transaction.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Location</p>
                  <p className="font-semibold">{transaction.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Device</p>
                  <p className="font-semibold">{transaction.device}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Transaction Amount</p>
                <p className="text-3xl font-bold">${transaction.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">Timestamp</p>
                <p className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isRisk ? "border-red-200 bg-red-50/10" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRisk ? (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              )}
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground uppercase mb-1">Risk Score</p>
              <p
                className={`text-5xl font-black ${transaction.riskScore > 0.6 ? "text-red-500" : transaction.riskScore > 0.3 ? "text-orange-500" : "text-green-500"}`}
              >
                {(transaction.riskScore * 100).toFixed(1)}%
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase">Explainability Factors</p>
              <ul className="space-y-2">
                {transaction.reasons.map((reason: string, i: number) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
