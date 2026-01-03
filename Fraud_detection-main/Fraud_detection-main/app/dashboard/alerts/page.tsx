// app/alerts/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, ExternalLink, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertActions } from "@/components/alerts/alert-actions"

async function getAlerts() {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/alerts?limit=20`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch alerts')
  }
  
  const data = await res.json()
  return data.alerts
}

export default async function AlertsPage() {
  const alerts = await getAlerts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Security Alerts</h2>
        <Badge variant="outline">
          {alerts.filter((a: any) => a.status === 'pending').length} Pending
        </Badge>
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
              <Card 
                key={alert._id} 
                className={`
                  ${alert.severity === "HIGH" ? "border-red-200 bg-red-50/50" : ""}
                  ${alert.severity === "MEDIUM" ? "border-orange-200 bg-orange-50/50" : ""}
                  ${alert.status !== "pending" ? "opacity-60" : ""}
                `}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={
                      alert.severity === "HIGH" ? "text-red-500" : "text-orange-500"
                    } />
                    <CardTitle className="text-sm font-medium">
                      Potential Fraud Detected
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={alert.severity === "HIGH" ? "destructive" : "secondary"}>
                      {alert.severity}
                    </Badge>
                    {alert.status !== "pending" && (
                      <Badge variant="outline">{alert.status}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Transaction ID: {alert.transactionId}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alert.reasons.map((r: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {(alert.riskScore * 100).toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <AlertActions alertId={alert._id} currentStatus={alert.status} />
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
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Alerts are automatically generated when transactions exceed risk thresholds.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>HIGH Risk:</span>
                  <span className="font-medium">≥ 70%</span>
                </div>
                <div className="flex justify-between">
                  <span>MEDIUM Risk:</span>
                  <span className="font-medium">40-70%</span>
                </div>
                <div className="flex justify-between">
                  <span>LOW Risk:</span>
                  <span className="font-medium">&lt;40%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}