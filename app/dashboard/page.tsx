"use client"

import React, { useCallback, useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BehaviorTracker } from "@/components/behavior-tracker"
import { AnomalyFeed, type AnomalyEvent } from "@/components/anomaly-feed"
import { ReAuthDialog } from "@/components/re-auth-dialog"
import { User, LogOut, Settings, Shield, Building2 } from "lucide-react"

export default function DashboardPage() {
  const [events, setEvents] = useState<AnomalyEvent[]>([])
  const [needsReauth, setNeedsReauth] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  // Don't render if not authenticated
  if (!session) {
    return null
  }

  const handleAnomaly = useCallback((s: any) => {
    const details = s.score >= 3.5 ? "Severe deviation in mouse/typing pattern" : "Moderate deviation detected"
    setEvents((prev) => [...prev, { at: new Date(), score: s.score, details }])
    if (s.score >= 3.5) setNeedsReauth(true)
  }, [])

  return (
    <main className="min-h-dvh">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-lg">BioBehavior Secure</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span>{session.user.department}</span>
                <Badge variant="secondary" className="text-xs">
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/enroll')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Biometric Setup</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
