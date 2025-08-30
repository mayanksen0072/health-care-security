"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fingerprint, Eye, Shield, User, Mail, Lock, Camera } from "lucide-react"
import dynamic from 'next/dynamic'
import { biometricAuth } from "@/lib/biometric-auth"

import { ErrorBoundary } from "@/components/error-boundary"

// Dynamic imports to avoid chunk loading issues
const FaceRecognition = dynamic(() => import("@/components/biometric/face-recognition").then(mod => ({ default: mod.FaceRecognition })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
})

const FingerprintAuth = dynamic(() => import("@/components/biometric/fingerprint-auth").then(mod => ({ default: mod.FingerprintAuth })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
})

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
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showBiometricAuth, setShowBiometricAuth] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  // Handle error from URL params
  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const handleBiometricAuth = async (email: string) => {
    setSelectedEmail(email)
    setShowBiometricAuth(true)
  }

  const handleBiometricSuccess = async () => {
    // Sign in with the selected email
    const result = await signIn("credentials", {
      email: selectedEmail,
      password: "password123", // Demo password
      redirect: false,
    })
    
    if (result?.error) {
      setError("Biometric authentication failed")
    }
    
    setShowBiometricAuth(false)
  }

  const handleBiometricError = (error: string) => {
    setError(error)
    setShowBiometricAuth(false)
  }

  const handleBiometricCancel = () => {
    setShowBiometricAuth(false)
  }

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })

    setIsLoading(false)
    
    if (result?.error) {
      setError("Invalid email or password")
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Healthcare Secure</CardTitle>
          <CardDescription>Multi-factor authentication for clinical environments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="biometric" className="w-full" onValueChange={() => setError(null)}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="biometric" className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Biometric
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="biometric" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Quick Biometric Login</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a user to authenticate with biometrics
                  </p>
                </div>
                
                <div className="grid gap-2">
                  {[
                    { email: "sarah.johnson@clinic.org", name: "Dr. Sarah Johnson", role: "Physician" },
                    { email: "michael.chen@clinic.org", name: "Dr. Michael Chen", role: "Physician" },
                    { email: "emily.rodriguez@clinic.org", name: "Nurse Emily Rodriguez", role: "Nurse" },
                    { email: "admin@clinic.org", name: "Admin User", role: "Admin" }
                  ].map((user) => (
                    <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleBiometricAuth(user.email)}
                          className="flex items-center gap-1"
                        >
                          <Shield className="h-3 w-3" />
                          Login
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="password">
              <form className="space-y-4" onSubmit={onPasswordLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="you@clinic.org" 
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="text-center text-sm text-muted-foreground">Or continue with</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                      Google
                    </Button>
                    <Button variant="outline" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
                      GitHub
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900 mb-2">Demo Credentials</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div><strong>Physician:</strong> sarah.johnson@clinic.org / password123</div>
              <div><strong>Nurse:</strong> emily.rodriguez@clinic.org / password123</div>
              <div><strong>Admin:</strong> admin@clinic.org / password123</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Biometric Authentication Modal */}
      {showBiometricAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Biometric Authentication</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBiometricCancel}
                >
                  ×
                </Button>
              </div>
              
              <Tabs value={mode} onValueChange={(value) => setMode(value as "face" | "fingerprint")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="face" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Face
                  </TabsTrigger>
                  <TabsTrigger value="fingerprint" className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    Fingerprint
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="face" className="mt-4">
                  <ErrorBoundary>
                    <FaceRecognition
                      email={selectedEmail}
                      mode="verify"
                      onSuccess={handleBiometricSuccess}
                      onError={handleBiometricError}
                      onCancel={handleBiometricCancel}
                    />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="fingerprint" className="mt-4">
                  <ErrorBoundary>
                    <FingerprintAuth
                      email={selectedEmail}
                      mode="verify"
                      onSuccess={handleBiometricSuccess}
                      onError={handleBiometricError}
                      onCancel={handleBiometricCancel}
                    />
                  </ErrorBoundary>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
