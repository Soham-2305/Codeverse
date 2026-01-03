import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RecentAlertsProps {
  alerts: any[]
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Suspicious Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert._id}>
                  <TableCell className="font-mono text-xs">{alert.transactionId.substring(0, 8)}...</TableCell>
                  <TableCell>{(alert.riskScore * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant={alert.severity === "HIGH" ? "destructive" : "warning"} className="capitalize">
                      {alert.severity.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
