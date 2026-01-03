import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShieldAlert, ShieldCheck, Smartphone, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function getTransaction(id: string) {
  await dbConnect()
  return await Transaction.findOne({ transactionId: id }).lean()
}

export default async function TransactionDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const transaction: any = await getTransaction(params.id)

  if (!transaction) {
    notFound()
  }

  const isHighRisk = transaction.riskLevel === "HIGH"

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Transaction Details
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* ================= CORE DETAILS ================= */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction Info</CardTitle>
              <Badge
                variant={
                  transaction.riskLevel === "HIGH"
                    ? "destructive"
                    : transaction.riskLevel === "MEDIUM"
                    ? "secondary"
                    : "default"
                }
              >
                {transaction.riskLevel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  UPI ID
                </p>
                <p className="font-semibold">{transaction.upiId}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Amount
                </p>
                <p className="font-semibold">
                  ₹{typeof transaction.amount === "number"
  ? transaction.amount.toLocaleString()
  : "N/A"}

                </p>
              </div>

              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Device ID
                  </p>
                  <p className="font-semibold">
                    {transaction.deviceId || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Location (Lat)
                  </p>
                  <p className="font-semibold">
                    {transaction.latitude ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg flex justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  ML Fraud Probability
                </p>
                <p className="text-2xl font-bold">
                  {typeof transaction.mlProbability === "number"
  ? (transaction.mlProbability * 100).toFixed(1) + "%"
  : "N/A"}

                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">
                  Timestamp
                </p>
                <p className="text-sm">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= RISK SUMMARY ================= */}
        <Card className={isHighRisk ? "border-red-200 bg-red-50/10" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isHighRisk ? (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              )}
              Risk Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground uppercase">
              Risk Level
            </p>
            <p
              className={`text-4xl font-bold ${
                isHighRisk
                  ? "text-red-500"
                  : transaction.riskLevel === "MEDIUM"
                  ? "text-orange-500"
                  : "text-green-500"
              }`}
            >
              {transaction.riskLevel}
            </p>

            <p className="text-xs text-muted-foreground">
              (Hybrid rules not yet applied)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
