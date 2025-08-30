"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ReAuthDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess: () => void
}) {
  const [scanning, setScanning] = useState(false)
  const doScan = async () => {
    setScanning(true)
    await new Promise((r) => setTimeout(r, 1200))
    setScanning(false)
    onSuccess()
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Re-authentication</DialogTitle>
          <DialogDescription>
            We detected unusual behavior. Please confirm your identity to keep your session active.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border p-4 grid place-items-center">
          <div
            className={`size-24 rounded-full border-2 ${scanning ? "border-blue-600 animate-pulse" : "border-blue-200"}`}
            aria-hidden
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={scanning}>
            Cancel
          </Button>
          <Button onClick={doScan} disabled={scanning}>
            {scanning ? "Scanning..." : "Re-scan now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
