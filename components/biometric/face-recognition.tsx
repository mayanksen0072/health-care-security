"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Camera, UserCheck, UserX, Loader2, Shield } from 'lucide-react'
import { biometricAuth } from '@/lib/biometric-auth'

interface FaceRecognitionProps {
  email: string
  mode: 'enroll' | 'verify'
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

export function FaceRecognition({ email, mode, onSuccess, onError, onCancel }: FaceRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const mediaStream = await biometricAuth.startCamera()
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not found'))
            return
          }
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(resolve).catch(reject)
          }
          
          videoRef.current.onerror = () => {
            reject(new Error('Failed to load video'))
          }
          
          // Timeout after 10 seconds
          setTimeout(() => reject(new Error('Video loading timeout')), 10000)
        })
      }
      
      // Start face detection loop
      detectFace()
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to access camera'
      setError(`Failed to access camera: ${errorMsg}. Please check permissions.`)
      onError('Camera access denied')
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    biometricAuth.stopCamera()
  }

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return

    try {
      // Check if video is ready
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const detection = await biometricAuth.captureFaceDescriptor(videoRef.current)
        setFaceDetected(true)
        
        // Draw face detection overlay
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.strokeStyle = '#10b981'
          ctx.lineWidth = 3
          ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)
          
          // Draw success indicator
          ctx.fillStyle = '#10b981'
          ctx.beginPath()
          ctx.arc(canvas.width - 50, 50, 20, 0, 2 * Math.PI)
          ctx.fill()
        }
      } else {
        setFaceDetected(false)
      }
      
    } catch (error) {
      setFaceDetected(false)
      
      // Clear canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Continue detection loop with a delay to prevent excessive calls
    setTimeout(() => {
      requestAnimationFrame(detectFace)
    }, 100)
  }

  const handleCapture = async () => {
    if (!videoRef.current || !faceDetected) return

    try {
      setIsProcessing(true)
      setError(null)

      let success = false
      
      if (mode === 'enroll') {
        success = await biometricAuth.enrollFace(email, videoRef.current)
      } else {
        success = await biometricAuth.verifyFace(email, videoRef.current)
      }

      if (success) {
        onSuccess()
      } else {
        const errorMsg = mode === 'enroll' 
          ? 'Face enrollment failed. Please try again.' 
          : 'Face verification failed. Please try again.'
        setError(errorMsg)
        onError(errorMsg)
      }

    } catch (error) {
      const errorMsg = 'Biometric authentication failed'
      setError(errorMsg)
      onError(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {mode === 'enroll' ? 'Enroll Face' : 'Face Recognition'}
        </CardTitle>
        <CardDescription>
          {mode === 'enroll' 
            ? 'Position your face in the camera to enroll your biometric data'
            : 'Look at the camera to verify your identity'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded-lg bg-gray-900"
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-64 rounded-lg pointer-events-none"
            width={640}
            height={480}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-white" />
                <p className="text-white text-sm">Starting camera...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {faceDetected ? (
              <>
                <UserCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Face detected</span>
              </>
            ) : (
              <>
                <UserX className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">No face detected</span>
              </>
            )}
          </div>
          
          <Badge variant={faceDetected ? "default" : "secondary"}>
            {faceDetected ? "Ready" : "Waiting"}
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCapture}
            disabled={!faceDetected || isProcessing || isLoading}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                {mode === 'enroll' ? 'Enroll Face' : 'Verify Face'}
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

        <div className="text-xs text-muted-foreground text-center">
          <p>• Ensure good lighting and face the camera directly</p>
          <p>• Keep your face within the green border</p>
          <p>• Remove glasses or hats for better accuracy</p>
        </div>
      </CardContent>
    </Card>
  )
}
