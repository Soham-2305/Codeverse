import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveTableProps {
  transactions: any[]
}

export function LiveTable({ transactions }: LiveTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t._id}>
              <TableCell className="font-mono text-xs">{t.transactionId.substring(0, 8)}</TableCell>
              <TableCell>${t.amount.toLocaleString()}</TableCell>
              <TableCell className="max-w-[150px] truncate">{t.merchant}</TableCell>
              <TableCell>{(t.riskScore * 100).toFixed(0)}%</TableCell>
              <TableCell>
                <Badge
                  variant={t.decision === "BLOCK" ? "destructive" : t.decision === "FLAG" ? "warning" : "outline"}
                  className={t.decision === "ALLOW" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}
                >
                  {t.decision}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/transactions/${t.transactionId}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
