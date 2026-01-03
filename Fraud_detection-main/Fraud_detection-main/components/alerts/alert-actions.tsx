// components/alerts/alert-actions.tsx
'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AlertActionsProps {
  alertId: string
  currentStatus: string
}

export function AlertActions({ alertId, currentStatus }: AlertActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateAlert = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reviewed_by: 'current_user', // Replace with actual user ID
        }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update alert:', error)
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus !== 'pending') {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateAlert('reviewed')}
        disabled={loading}
        className="text-green-600 hover:text-green-700"
      >
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateAlert('dismissed')}
        disabled={loading}
        className="text-red-600 hover:text-red-700"
      >
        <XCircle className="mr-1 h-3 w-3" />
        Dismiss
      </Button>
    </div>
  )
}