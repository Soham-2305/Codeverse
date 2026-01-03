import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from "lucide-react"

interface StatCardsProps {
  total: number
  fraud: number
  flagged: number
  avgRisk: number
}

export function StatCards({ total, fraud, flagged, avgRisk }: StatCardsProps) {
  const stats = [
    {
      title: "Total Transactions",
      value: total,
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Blocked (Fraud)",
      value: fraud,
      icon: ShieldAlert,
      color: "text-red-500",
    },
    {
      title: "Flagged (Suspicious)",
      value: flagged,
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: "Avg Risk Score",
      value: `${(avgRisk * 100).toFixed(1)}%`,
      icon: ShieldCheck,
      color: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
