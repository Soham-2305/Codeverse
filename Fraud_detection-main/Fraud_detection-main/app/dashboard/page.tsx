import { StatCards } from "@/components/dashboard/stat-cards"
import { RiskTimeline } from "@/components/dashboard/risk-timeline"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import dbConnect from "@/lib/db"
import Transaction from "@/models/Transaction"
import Alert from "@/models/Alert"

async function getDashboardData() {
    await dbConnect()

    const [transactions, alerts] = await Promise.all([
        Transaction.find().sort({ createdAt: -1 }).limit(50).lean(),
        Alert.find().sort({ createdAt: -1 }).limit(5).lean(),
    ])

    const stats = {
        total: await Transaction.countDocuments(),
        fraud: await Transaction.countDocuments({ decision: "BLOCK" }),
        flagged: await Transaction.countDocuments({ decision: "FLAG" }),
        avgRisk: 0,
    }

    if (stats.total > 0) {
        const avgRiskResult = await Transaction.aggregate([{ $group: { _id: null, avgRisk: { $avg: "$riskScore" } } }])
        stats.avgRisk = avgRiskResult[0]?.avgRisk || 0
    }

    // Formatting timeline data
    const timelineData = transactions
        .map((t: any) => ({
            timestamp: t.createdAt,
            riskScore: t.riskScore,
        }))
        .reverse()

    return { stats, alerts, timelineData }
}

export default async function DashboardPage() {
    const { stats, alerts, timelineData } = await getDashboardData()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h2>
            </div>

            <StatCards total={stats.total} fraud={stats.fraud} flagged={stats.flagged} avgRisk={stats.avgRisk} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RiskTimeline data={timelineData} />
                <RecentAlerts alerts={alerts} />
            </div>
        </div>
    )
}
