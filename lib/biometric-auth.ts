// Dynamic import to avoid SSR issues
let faceapi: any = null

const loadFaceApi = async () => {
  if (!faceapi) {
    try {
      faceapi = await import('face-api.js')
    } catch (error) {
      console.error('Failed to load face-api.js:', error)
      throw new Error('Face recognition library failed to load')
    }
  }
  return faceapi
}

// Mock biometric data for demo users
let biometricData: Record<string, {
  faceDescriptor: Float32Array | null;
  fingerprintId: string;
  enrolled: boolean;
}> = {
  'sarah.johnson@clinic.org': {
    faceDescriptor: null, // Will be set during enrollment
    fingerprintId: 'fp_sarah_001',
    enrolled: false
  },
  'michael.chen@clinic.org': {
    faceDescriptor: null,
    fingerprintId: 'fp_michael_002', 
    enrolled: false
  },
  'emily.rodriguez@clinic.org': {
    faceDescriptor: null,
    fingerprintId: 'fp_emily_003',
    enrolled: false
  },
  'admin@clinic.org': {
    faceDescriptor: null,
    fingerprintId: 'fp_admin_004',
    enrolled: false
  }
}

export class BiometricAuth {
  private static instance: BiometricAuth
  private modelsLoaded = false
  private stream: MediaStream | null = null

  static getInstance(): BiometricAuth {
    if (!BiometricAuth.instance) {
      BiometricAuth.instance = new BiometricAuth()
    }
    return BiometricAuth.instance
  }

  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return

    try {
      const faceApi = await loadFaceApi()
      
      // Load models with timeout and retry
      const loadModel = async (modelLoader: any, modelName: string) => {
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout loading ${modelName}`)), 30000)
        )
        
        return Promise.race([
          modelLoader.loadFromUri('/models'),
          timeout
        ])
      }

      await Promise.all([
        loadModel(faceApi.nets.tinyFaceDetector, 'TinyFaceDetector'),
        loadModel(faceApi.nets.faceLandmark68Net, 'FaceLandmark68Net'),
        loadModel(faceApi.nets.faceRecognitionNet, 'FaceRecognitionNet')
      ])
      
      this.modelsLoaded = true
    } catch (error) {
      console.error('Failed to load face-api models:', error)
      throw new Error(`Failed to load biometric models: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async startCamera(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      })
      return this.stream
    } catch (error) {
      console.error('Failed to access camera:', error)
      throw new Error('Camera access denied')
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  async captureFaceDescriptor(video: HTMLVideoElement): Promise<Float32Array> {
    if (!this.modelsLoaded) {
      await this.loadModels()
    }

    // Ensure video is playing and has data
    if (video.readyState < 2) {
      throw new Error('Video not ready')
    }

    const faceApi = await loadFaceApi()
    
    // Create a canvas to capture the current frame
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Detect face in the canvas
    const detection = await faceApi
      .detectSingleFace(canvas, new faceApi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      throw new Error('No face detected')
    }

    return detection.descriptor
  }

  async enrollFace(email: string, video: HTMLVideoElement): Promise<boolean> {
    try {
      const descriptor = await this.captureFaceDescriptor(video)
      
      // Initialize user if not exists
      if (!biometricData[email]) {
        biometricData[email] = {
          faceDescriptor: null,
          fingerprintId: `fp_${email.split('@')[0]}_${Date.now()}`,
          enrolled: false
        }
      }
      
      biometricData[email].faceDescriptor = descriptor
      biometricData[email].enrolled = true
      return true
    } catch (error) {
      console.error('Face enrollment failed:', error)
      return false
    }
  }

  async verifyFace(email: string, video: HTMLVideoElement): Promise<boolean> {
    try {
      if (!biometricData[email] || !biometricData[email].enrolled) {
        return false
      }

      const currentDescriptor = await this.captureFaceDescriptor(video)
      const storedDescriptor = biometricData[email].faceDescriptor

      if (!storedDescriptor) {
        return false
      }

      // Calculate similarity using Euclidean distance
      const faceApi = await loadFaceApi()
      const distance = faceApi.euclideanDistance(currentDescriptor, storedDescriptor)
      const threshold = 0.6 // Lower threshold = more strict matching

      return distance < threshold
    } catch (error) {
      console.error('Face verification failed:', error)
      return false
    }
  }

  async checkFingerprintSupport(): Promise<boolean> {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      return false
    }

    // Check if biometric authentication is available
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      return available
    } catch (error) {
      console.error('Fingerprint support check failed:', error)
      return false
    }
  }

  async createFingerprintCredential(email: string, name: string): Promise<PublicKeyCredential | null> {
    try {
      // Generate a challenge
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      // Create user ID from email
      const userId = new Uint8Array(16)
      crypto.getRandomValues(userId)

      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'Healthcare Security Platform',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: email,
          displayName: name,
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7, // ES256
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: 'direct',
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential

      return credential
    } catch (error) {
      console.error('Fingerprint credential creation failed:', error)
      return null
    }
  }

  async verifyFingerprintCredential(email: string): Promise<boolean> {
    try {
      // Generate a challenge
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
      }

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyOptions,
      }) as PublicKeyCredential

      return !!assertion
    } catch (error) {
      console.error('Fingerprint verification failed:', error)
      return false
    }
  }

  async verifyFingerprint(email: string): Promise<boolean> {
    try {
      if (!biometricData[email] || !biometricData[email].enrolled) {
        return false
      }

      // Check if fingerprint is supported
      const supported = await this.checkFingerprintSupport()
      if (!supported) {
        throw new Error('Fingerprint authentication is not supported on this device')
      }

      // Verify fingerprint using WebAuthn
      const success = await this.verifyFingerprintCredential(email)
      return success
    } catch (error) {
      console.error('Fingerprint verification failed:', error)
      return false
    }
  }

  async enrollFingerprint(email: string, name: string): Promise<boolean> {
    try {
      // Initialize user if not exists
      if (!biometricData[email]) {
        biometricData[email] = {
          faceDescriptor: null,
          fingerprintId: `fp_${email.split('@')[0]}_${Date.now()}`,
          enrolled: false
        }
      }

      // Check if fingerprint is supported
      const supported = await this.checkFingerprintSupport()
      if (!supported) {
        throw new Error('Fingerprint authentication is not supported on this device')
      }

      // Create fingerprint credential using WebAuthn
      const credential = await this.createFingerprintCredential(email, name)
      if (!credential) {
        throw new Error('Failed to create fingerprint credential')
      }

      // Store credential data (in production, this would be stored securely)
      biometricData[email].fingerprintId = credential.id
      biometricData[email].enrolled = true

      return true
    } catch (error) {
      console.error('Fingerprint enrollment failed:', error)
      return false
    }
  }

  isEnrolled(email: string): boolean {
    return biometricData[email]?.enrolled || false
  }

  getEnrollmentStatus(email: string): { face: boolean; fingerprint: boolean } {
    const user = biometricData[email]
    return {
      face: user?.enrolled || false,
      fingerprint: user?.enrolled || false
    }
  }
}

export const biometricAuth = BiometricAuth.getInstance()
