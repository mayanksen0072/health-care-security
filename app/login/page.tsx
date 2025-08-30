"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function BiometricRing({ active }: { active: boolean }) {
  return (
    <div className="relative mx-auto size-40 rounded-full border-2 border-blue-600/30 grid place-items-center">
      <div className="size-28 rounded-full border-2 border-blue-600/60" />
      <div
        className={`absolute inset-0 rounded-full border-2 ${active ? "border-blue-600 animate-pulse" : "border-transparent"}`}
        aria-hidden
      />
      <span className="sr-only">{active ? "Scanning in progress" : "Scanner idle"}</span>
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<"face" | "fingerprint">("face")
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const simulateScan = async () => {
    setError(null)
    setScanning(true)
    await new Promise((r) => setTimeout(r, 1200))
    const ok = Math.random() > 0.08
    setScanning(false)
    if (ok) router.push("/dashboard")
    else setError("Scan failed. Please try again.")
  }

  const onPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Secure Login</CardTitle>
          <CardDescription>Biometric-first with password fallback</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="biometric" className="w-full" onValueChange={() => setError(null)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="biometric">Biometric</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="biometric" className="space-y-4">
              <div className="flex justify-center">
                <BiometricRing active={scanning} />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant={mode === "face" ? "default" : "outline"} onClick={() => setMode("face")}>
                  Use Face
                </Button>
                <Button variant={mode === "fingerprint" ? "default" : "outline"} onClick={() => setMode("fingerprint")}>
                  Use Fingerprint
                </Button>
              </div>
              <Button className="w-full" disabled={scanning} onClick={simulateScan}>
                {scanning ? "Scanning..." : `Scan ${mode === "face" ? "Face" : "Fingerprint"}`}
              </Button>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </TabsContent>

            <TabsContent value="password">
              <form className="space-y-3" onSubmit={onPasswordLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@clinic.org" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
                <p className="text-xs text-muted-foreground">Demo only. No data is stored.</p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
