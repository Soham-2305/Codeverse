"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck, ShieldAlert } from "lucide-react"

export function ThresholdSlider() {
  const { toast } = useToast()
  const [flag, setFlag] = useState(40)
  const [block, setBlock] = useState(70)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch("/api/threshold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: flag / 100, block: block / 100 }),
      })

      if (res.ok) {
        toast({
          title: "Thresholds Updated",
          description: `Flag: ${flag}%, Block: ${block}%`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update thresholds",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Sensitivity Settings</CardTitle>
        <CardDescription>Adjust when transactions should be flagged or blocked</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              Flag Threshold (Suspicious)
            </Label>
            <span className="font-bold">{flag}%</span>
          </div>
          <Slider value={[flag]} onValueChange={(vals) => setFlag(vals[0])} max={100} step={1} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              Block Threshold (Fraud)
            </Label>
            <span className="font-bold">{block}%</span>
          </div>
          <Slider value={[block]} onValueChange={(vals) => setBlock(vals[0])} max={100} step={1} />
        </div>

        <Button onClick={handleSave} className="w-full" disabled={loading}>
          Save Sensitivity Settings
        </Button>
      </CardContent>
    </Card>
  )
}

import { Label } from "@/components/ui/label"
