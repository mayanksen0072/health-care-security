"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import dynamic from 'next/dynamic'
import { biometricAuth } from '@/lib/biometric-auth'

import { ErrorBoundary } from '@/components/error-boundary'

// Dynamic imports to avoid chunk loading issues
const FaceRecognition = dynamic(() => import('@/components/biometric/face-recognition').then(mod => ({ default: mod.FaceRecognition })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
})

const FingerprintAuth = dynamic(() => import('@/components/biometric/fingerprint-auth').then(mod => ({ default: mod.FingerprintAuth })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
})
import { Shield, Camera, Fingerprint, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EnrollPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollmentStatus, setEnrollmentStatus] = useState<{ face: boolean; fingerprint: boolean }>({ face: false, fingerprint: false })
  const [currentTab, setCurrentTab] = useState('face')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      const status = biometricAuth.getEnrollmentStatus(session.user.email)
      setEnrollmentStatus(status)
    }
  }, [session])

  const handleFaceEnrollmentSuccess = () => {
    setEnrollmentStatus(prev => ({ ...prev, face: true }))
    setError(null)
  }

  const handleFingerprintEnrollmentSuccess = () => {
    setEnrollmentStatus(prev => ({ ...prev, fingerprint: true }))
    setError(null)
  }

  const handleEnrollmentError = (error: string) => {
    setError(error)
  }

  const handleComplete = () => {
    router.push('/dashboard')
  }

  if (status === 'loading') {
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  const isEnrolled = enrollmentStatus.face || enrollmentStatus.fingerprint
  const allEnrolled = enrollmentStatus.face && enrollmentStatus.fingerprint

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Biometric Enrollment</h1>
                <p className="text-muted-foreground">
                  Set up your biometric authentication for enhanced security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">User:</span>
                <span className="text-sm">{session.user.name}</span>
                <Badge variant="secondary">{session.user.role}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Department:</span>
                <span className="text-sm">{session.user.department}</span>
              </div>
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      enrollmentStatus.face ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Camera className={`h-5 w-5 ${
                        enrollmentStatus.face ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">Face Recognition</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollmentStatus.face ? 'Enrolled' : 'Not enrolled'}
                      </p>
                    </div>
                  </div>
                  {enrollmentStatus.face && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      enrollmentStatus.fingerprint ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Fingerprint className={`h-5 w-5 ${
                        enrollmentStatus.fingerprint ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">Fingerprint</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollmentStatus.fingerprint ? 'Enrolled' : 'Not enrolled'}
                      </p>
                    </div>
                  </div>
                  {enrollmentStatus.fingerprint && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Enroll Biometric Methods</CardTitle>
              <CardDescription>
                Choose which biometric methods you'd like to enroll. You can enroll both for maximum security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="face" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Face Recognition
                  </TabsTrigger>
                  <TabsTrigger value="fingerprint" className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    Fingerprint
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="face" className="mt-6">
                  {enrollmentStatus.face ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Face Recognition Enrolled</h3>
                      <p className="text-muted-foreground mb-4">
                        Your face has been successfully enrolled for biometric authentication.
                      </p>
                      <Button onClick={() => setCurrentTab('fingerprint')}>
                        Enroll Fingerprint
                      </Button>
                    </div>
                                     ) : (
                     <ErrorBoundary>
                       <FaceRecognition
                         email={session.user.email}
                         mode="enroll"
                         onSuccess={handleFaceEnrollmentSuccess}
                         onError={handleEnrollmentError}
                         onCancel={() => setCurrentTab('fingerprint')}
                       />
                     </ErrorBoundary>
                   )}
                </TabsContent>

                <TabsContent value="fingerprint" className="mt-6">
                  {enrollmentStatus.fingerprint ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Fingerprint Enrolled</h3>
                      <p className="text-muted-foreground mb-4">
                        Your fingerprint has been successfully enrolled for biometric authentication.
                      </p>
                      <Button onClick={() => setCurrentTab('face')}>
                        Enroll Face Recognition
                      </Button>
                    </div>
                                     ) : (
                     <ErrorBoundary>
                       <FingerprintAuth
                         email={session.user.email}
                         mode="enroll"
                         onSuccess={handleFingerprintEnrollmentSuccess}
                         onError={handleEnrollmentError}
                         onCancel={() => setCurrentTab('face')}
                       />
                     </ErrorBoundary>
                   )}
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {allEnrolled && (
                <div className="mt-6 text-center">
                  <Button onClick={handleComplete} size="lg">
                    Complete Enrollment
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can now use biometric authentication for secure login
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🔐 How it works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Face recognition uses AI to analyze facial features</li>
                    <li>• Fingerprint authentication uses device sensors</li>
                    <li>• Biometric data is encrypted and stored securely</li>
                    <li>• You can use either or both methods for login</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🛡️ Privacy & Security</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Biometric data never leaves your device</li>
                    <li>• No biometric data is stored on our servers</li>
                    <li>• You can revoke access at any time</li>
                    <li>• Compliant with healthcare security standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
