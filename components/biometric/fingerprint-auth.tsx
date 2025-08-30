"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Fingerprint, Shield, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { biometricAuth } from '@/lib/biometric-auth'

interface FingerprintAuthProps {
  email: string
  mode: 'enroll' | 'verify'
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

export function FingerprintAuth({ email, mode, onSuccess, onError, onCancel }: FingerprintAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fingerprintSupported, setFingerprintSupported] = useState<boolean | null>(null)

  useEffect(() => {
    checkFingerprintSupport()
  }, [])

  const checkFingerprintSupport = async () => {
    try {
      const supported = await biometricAuth.checkFingerprintSupport()
      setFingerprintSupported(supported)
      
      if (!supported) {
        setError('Fingerprint authentication is not supported on this device')
      }
    } catch (error) {
      setFingerprintSupported(false)
      setError('Failed to check fingerprint support')
    }
  }

  const handleFingerprintAuth = async () => {
    setIsProcessing(true)
    setStatus('scanning')
    setProgress(0)
    setError(null)

    try {
      // Update progress
      setProgress(20)
      await new Promise(resolve => setTimeout(resolve, 300))

      setProgress(40)
      await new Promise(resolve => setTimeout(resolve, 300))

      setProgress(60)
      await new Promise(resolve => setTimeout(resolve, 300))

      setProgress(80)
      await new Promise(resolve => setTimeout(resolve, 300))

      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Perform actual fingerprint authentication
      let success = false
      
      if (mode === 'enroll') {
        // For enrollment, we need the user's name
        const userName = email.split('@')[0] // Use email prefix as name
        success = await biometricAuth.enrollFingerprint(email, userName)
      } else {
        success = await biometricAuth.verifyFingerprint(email)
      }

      if (success) {
        setStatus('success')
        await new Promise(resolve => setTimeout(resolve, 1000))
        onSuccess()
      } else {
        setStatus('error')
        const errorMsg = mode === 'enroll' 
          ? 'Fingerprint enrollment failed. Please try again.' 
          : 'Fingerprint verification failed. Please try again.'
        setError(errorMsg)
        onError(errorMsg)
      }

    } catch (error) {
      setStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Fingerprint authentication failed'
      setError(errorMsg)
      onError(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  // Remove the old handleFingerprintAuth function since we replaced it above

  const getStatusIcon = () => {
    switch (status) {
      case 'scanning':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
      default:
        return <Fingerprint className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'scanning':
        return 'Scanning fingerprint...'
      case 'success':
        return 'Authentication successful!'
      case 'error':
        return 'Authentication failed'
      default:
        return mode === 'enroll' 
          ? 'Ready to enroll fingerprint' 
          : 'Ready to verify fingerprint'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          {mode === 'enroll' ? 'Enroll Fingerprint' : 'Fingerprint Authentication'}
        </CardTitle>
        <CardDescription>
          {mode === 'enroll' 
            ? 'Register your fingerprint for biometric authentication'
            : 'Use your fingerprint to verify your identity'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-50">
              {getStatusIcon()}
            </div>
            
            {status === 'scanning' && (
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            )}
          </div>
          
          <p className="mt-4 text-center text-sm font-medium">
            {getStatusMessage()}
          </p>
        </div>

        {status === 'scanning' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {fingerprintSupported === false && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Fingerprint authentication is not supported on this device. 
              Please use a device with a fingerprint sensor or try face recognition.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleFingerprintAuth}
            disabled={!fingerprintSupported || isProcessing || isLoading}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                {mode === 'enroll' ? 'Enroll Fingerprint' : 'Scan Fingerprint'}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• Ensure your finger is clean and dry</p>
          <p>• Place your finger firmly on the sensor</p>
          <p>• Keep your finger steady during scanning</p>
          {mode === 'enroll' && (
            <p>• You may need to scan multiple times for enrollment</p>
          )}
        </div>

        {fingerprintSupported && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Fingerprint sensor detected</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
