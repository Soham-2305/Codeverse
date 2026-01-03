import dbConnect from "@/lib/db"
import Alert from "@/models/Alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThresholdSlider } from "@/components/settings/threshold-slider"
import { AlertCircle, Clock, ExternalLink, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getAlerts() {
  await dbConnect()
  return await Alert.find().sort({ createdAt: -1 }).limit(20).lean()
}

export default async function AlertsPage() {
  const alerts = await getAlerts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Security Alerts</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">No active security alerts</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert: any) => (
              <Card key={alert._id} className={alert.severity === "HIGH" ? "border-red-200" : "border-orange-200"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={alert.severity === "HIGH" ? "text-red-500" : "text-orange-500"} />
                    <CardTitle className="text-sm font-medium">Potential Fraud Detected</CardTitle>
                  </div>
                  <Badge variant={alert.severity === "HIGH" ? "destructive" : "warning"}>{alert.severity}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Transaction ID: {alert.transactionId}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alert.reasons.map((r: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{(alert.riskScore * 100).toFixed(1)}%</p>
                      <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/transactions/${alert.transactionId}`}>
                        Review Transaction
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="md:col-span-4">
          <ThresholdSlider />
        </div>
      </div>
    </div>
  )
}
