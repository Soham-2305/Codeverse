"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function TransactionForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
    
    if (!token) {
      toast({
        title: "Not Authenticated",
        description: "Please login to create transactions",
        variant: "destructive",
      })
    }
  }, [toast])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      upiId,
      amount: Number(amount),
    }

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to create transactions",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token")
          document.cookie = "token=; path=/; max-age=0"
          
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }
        throw new Error(result.error || result.details || "Transaction failed")
      }

      toast({
        title: "✅ Transaction Processed Successfully",
        description: `Risk Level: ${result.riskLevel} | Score: ${result.riskScore}%`,
      })

      // Reset form using state
      setUpiId("")
      setAmount("")
      
      router.refresh()
    } catch (err: any) {
      console.error("Transaction error:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to process transaction",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulate UPI Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to create transactions
            </p>
            <Button onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulate UPI Transaction</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>UPI ID</Label>
            <Input 
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="amazon@upi" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number" 
              min="1" 
              step="0.01" 
              placeholder="1000"
              required 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Analyze Transaction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}