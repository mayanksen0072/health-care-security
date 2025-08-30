"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"

export type AnomalyEvent = {
  at: Date
  score: number
  details: string
}

export function AnomalyFeed({ events }: { events: AnomalyEvent[] }) {
  const items = useMemo(() => [...events].reverse().slice(0, 6), [events])
  return (
    <div className="rounded-md border">
      <div className="border-b p-3 font-medium">Anomaly Feed</div>
      <ul className="divide-y">
        {items.length === 0 && <li className="p-3 text-sm text-muted-foreground">No anomalies detected yet.</li>}
        {items.map((e, idx) => (
          <li key={idx} className="p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm">{e.details}</div>
              <div className="text-xs text-muted-foreground">{e.at.toLocaleTimeString()}</div>
            </div>
            <Badge variant={e.score >= 3.5 ? "destructive" : "secondary"}>Score {e.score.toFixed(2)}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
