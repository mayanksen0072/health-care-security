"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BehaviorTracker } from "@/components/behavior-tracker"
import { AnomalyFeed, type AnomalyEvent } from "@/components/anomaly-feed"
import { ReAuthDialog } from "@/components/re-auth-dialog"

export default function DashboardPage() {
  const [events, setEvents] = useState<AnomalyEvent[]>([])
  const [needsReauth, setNeedsReauth] = useState(false)

  const handleAnomaly = useCallback((s: any) => {
    const details = s.score >= 3.5 ? "Severe deviation in mouse/typing pattern" : "Moderate deviation detected"
    setEvents((prev) => [...prev, { at: new Date(), score: s.score, details }])
    if (s.score >= 3.5) setNeedsReauth(true)
  }, [])

  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-blue-600" aria-hidden />
            <span className="font-semibold">BioBehavior Secure</span>
            <Badge variant="secondary" className="ml-2">
              Demo EHR
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign out</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
              <CardDescription>Search and open a chart</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="Search patients by name or MRN" />
                <Button className="sm:w-40">Search</Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Alex Johnson", mrn: "A10422", dept: "Cardiology" },
                  { name: "Maya Patel", mrn: "M98012", dept: "Oncology" },
                  { name: "Diego Ramirez", mrn: "D33218", dept: "Pediatrics" },
                  { name: "Yuki Tanaka", mrn: "Y55201", dept: "Neurology" },
                ].map((p) => (
                  <div key={p.mrn} className="rounded-md border p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        MRN {p.mrn} • {p.dept}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Open Chart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continuous Authentication</CardTitle>
              <CardDescription>Real-time signals and anomaly scoring</CardDescription>
            </CardHeader>
            <CardContent>
              <BehaviorTracker onAnomaly={handleAnomaly} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Status</CardTitle>
              <CardDescription>Adaptive trust and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3">
                <div className="text-sm text-muted-foreground">Policy</div>
                <div className="mt-1 text-sm">
                  - Initial biometric required
                  <br />- Continuous monitoring active
                  <br />- Re-auth on severe anomaly
                </div>
              </div>
              <Button onClick={() => setNeedsReauth(true)} className="w-full">
                Trigger Re-auth (demo)
              </Button>
            </CardContent>
          </Card>

          <AnomalyFeed events={events} />
        </div>
      </section>

      <ReAuthDialog open={needsReauth} onOpenChange={setNeedsReauth} onSuccess={() => {}} />
    </main>
  )
}
