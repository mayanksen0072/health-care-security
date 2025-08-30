# 🔐 Biometric Behavior MVP - Healthcare Security Platform

> **A Next.js-based MVP demonstrating continuous authentication for healthcare environments using biometric login and behavioral monitoring.**

## 🎯 Key Highlights

- 🏥 **Healthcare-First Design** - Built specifically for clinical workflows
- 🔐 **Biometric + Behavioral Security** - Dual-layer authentication system
- ⚡ **Zero-Friction Protection** - Background monitoring without disruption
- 📊 **Real-Time Analytics** - Live behavioral pattern analysis
- 🚨 **Smart Anomaly Detection** - Adaptive scoring and alerts
- 🛡️ **HIPAA-Ready Architecture** - Compliance-focused security

## 🏥 Overview

This project showcases a **medical-grade security solution** that combines biometric authentication with passive behavioral monitoring to provide continuous protection for Electronic Health Record (EHR) systems without disrupting clinical workflows.

### ✨ Key Features

- **🔐 Multi-Provider Authentication**: Credentials, Google OAuth, GitHub OAuth, and real biometric authentication
- **📱 Real Biometric Authentication**: Face recognition using camera and fingerprint sensor support
- **👥 Role-Based Access Control**: Physicians, Nurses, and Admins with department assignments
- **📊 Continuous Behavioral Monitoring**: Real-time tracking of typing patterns and mouse movements
- **🚨 Anomaly Detection**: Adaptive scoring system that flags suspicious behavior
- **⚡ Zero-Friction Security**: Background monitoring without interrupting user workflows
- **🏥 Healthcare-Focused**: Designed specifically for clinical environments and HIPAA compliance
- **📈 Real-Time Analytics**: Live dashboards and behavioral insights
- **🔄 Adaptive Trust Scoring**: Dynamic security based on user behavior
- **🎯 Session Takeover Prevention**: Detect unauthorized access attempts
- **🛡️ JWT Session Management**: Secure token-based authentication with automatic validation
- **🔒 Biometric Enrollment**: Secure setup and management of biometric authentication methods

## 🚀 Quick Start

### 📋 Prerequisites

- ✅ **Node.js 18+** 
- 📦 **npm or yarn** package manager
- 🌐 **Modern browser** (Chrome, Firefox, Safari, Edge)

### ⚙️ Installation

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd biometric-behavior-mvp
   ```

2. **📦 Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > ⚠️ **Note**: Using `--legacy-peer-deps` to resolve React 19 compatibility issues

3. **▶️ Start the development server**
   ```bash
   npm run dev
   ```

4. **🌐 Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎯 What You'll See
- 🏠 **Landing Page** - Project overview and features
- 🔐 **Login Demo** - Simulated biometric authentication
- 📊 **Dashboard** - Live behavioral monitoring and EHR interface

## 📱 Demo Walkthrough

### 🏠 1. Landing Page
- 📋 **Overview** of the healthcare security platform
- ⭐ **Feature highlights** and compliance badges
- 🚀 **"Start Demo"** button to begin the experience
- 🏥 **Healthcare-focused** messaging and use cases

### 🔐 2. Login Page
- 🔐 **Multi-provider authentication** (Credentials, Google, GitHub)
- 📱 **Real biometric authentication** (Face recognition + Fingerprint)
- 👥 **Role-based user management** with demo credentials
- 🔒 **Demonstrates the initial security layer**
- 🎯 **User-friendly** authentication flow

### 📊 3. Dashboard (Demo EHR)
- 👤 **User Profile**: Display authenticated user information and role
- 🔒 **Biometric Setup**: Link to enroll face and fingerprint authentication
- 👥 **Patient Management**: Search and view mock patient records
- 🔄 **Continuous Authentication**: Real-time behavioral monitoring
- 🛡️ **Session Status**: Trust scoring and security controls
- 🚨 **Anomaly Feed**: Live detection of suspicious behavior patterns
- 📈 **Real-time Analytics**: Behavioral metrics and charts

### 🔐 4. Biometric Enrollment Page
- 📱 **Face Recognition Setup**: Camera-based facial enrollment
- 👆 **Fingerprint Enrollment**: Device sensor-based fingerprint setup
- 🔒 **Secure Enrollment**: Encrypted biometric data storage
- 📊 **Enrollment Status**: Track completion of biometric methods
- 🛡️ **Privacy Controls**: User-controlled biometric data management

## 🔧 Technical Architecture

### 🛠️ Frontend Stack
- ⚡ **Framework**: Next.js 15.2.4 with App Router
- ⚛️ **UI Library**: React 19 with TypeScript
- 🎨 **Styling**: Tailwind CSS with shadcn/ui components
- 📊 **Charts**: Recharts for real-time data visualization
- 🔄 **State Management**: React hooks and local state
- 🔐 **Authentication**: NextAuth.js with JWT sessions
- 📱 **Biometric Auth**: Face-api.js for face recognition, WebAuthn for fingerprint

### 🔧 Key Components

#### 📊 Behavior Tracker (`components/behavior-tracker.tsx`)
- ⌨️ **Monitors typing patterns** (rate, intervals, keystrokes)
- 🖱️ **Tracks mouse movements** (speed, distance, clicks)
- 🧮 **Calculates real-time anomaly scores**
- 📈 **Provides adaptive trust scoring**

#### 🚨 Anomaly Feed (`components/anomaly-feed.tsx`)
- 📋 **Displays detected behavioral anomalies**
- ⚠️ **Shows severity scoring and timestamps**
- ⏰ **Real-time event logging**

#### 🔐 Re-Auth Dialog (`components/re-auth-dialog.tsx`)
- 🚨 **Triggers when severe anomalies are detected**
- 🔄 **Provides seamless re-authentication flow**

### 📊 Behavioral Metrics Tracked

| 📈 Metric | 📝 Description | ⚖️ Weight |
|-----------|----------------|-----------|
| ⌨️ Typing Rate | Keys per second | 35% |
| 🖱️ Mouse Speed | Pixels per second | 35% |
| 🖱️ Click Patterns | Click frequency and timing | 15% |
| ⏸️ Idle Ratio | Inactivity periods | 15% |

### 🎯 Anomaly Scoring
- 🟢 **Score 0-2.0**: Normal behavior
- 🟡 **Score 2.2-3.4**: Moderate anomaly (logged)
- 🔴 **Score 3.5+**: Severe anomaly (triggers re-auth)

## 🏗️ Project Structure

```
biometric-behavior-mvp/
├── 📁 app/                    # Next.js App Router pages
│   ├── 📊 dashboard/         # Main EHR dashboard
│   ├── 🔐 login/            # Authentication page
│   ├── 🔐 enroll/           # Biometric enrollment page
│   ├── 🏠 page.tsx          # Landing page
│   └── api/auth/            # NextAuth API routes
├── 🧩 components/           # React components
│   ├── 🎨 ui/              # shadcn/ui components
│   ├── 🔐 auth/            # Authentication components
│   ├── 📱 biometric/       # Biometric authentication components
│   ├── 🚨 anomaly-feed.tsx # Anomaly detection display
│   ├── 📊 behavior-tracker.tsx # Behavioral monitoring
│   └── 🔐 re-auth-dialog.tsx # Re-authentication modal
├── 📚 lib/                 # Utility functions
├── 🪝 hooks/               # Custom React hooks
├── 📝 types/               # TypeScript type definitions
└── 📂 public/              # Static assets
```

## 🔒 Security Features

### 🔄 Continuous Authentication
- 📊 **Baseline Establishment**: First 10 seconds establish user behavior patterns
- ⏰ **Real-time Monitoring**: Continuous tracking of behavioral signals
- 📈 **Adaptive Trust**: Dynamic trust scoring based on recent activity
- 🧮 **Anomaly Detection**: Statistical analysis of behavioral deviations

### 🏥 Healthcare Compliance
- 🛡️ **HIPAA-Ready Architecture**: Designed for healthcare data protection
- 📋 **HITECH Alignment**: Supports meaningful use requirements
- 🔐 **SOC 2 Considerations**: Security and availability controls
- 🌐 **ISO 27001 Framework**: Information security management

## 🎯 Use Cases

### 🎯 Primary Scenarios
1. 🚨 **Session Takeover Prevention**: Detect when unauthorized users access active sessions
2. 🏥 **Clinical Workflow Protection**: Maintain security without disrupting patient care
3. 📋 **Compliance Demonstration**: Show adherence to healthcare security standards
4. 📊 **User Behavior Analysis**: Understand normal vs. anomalous patterns

### 🧪 Demo Scenarios
- ✅ **Normal Usage**: Type and navigate naturally to see baseline establishment
- 🔄 **Anomaly Simulation**: Use different typing patterns or mouse movements
- 🔐 **Re-authentication**: Trigger security prompts through behavioral changes
- 📈 **Trust Scoring**: Watch how behavior affects session trust levels

## 🛠️ Development

### 📜 Available Scripts
```bash
npm run dev      # 🚀 Start development server
npm run build    # 📦 Build for production
npm run start    # ▶️ Start production server
npm run lint     # 🔍 Run ESLint
```

### ⚙️ Environment Setup
The project uses NextAuth.js for authentication. For setup instructions, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md).

For production deployment, consider:
- 🔧 **Environment variables** for API endpoints and OAuth providers
- 🗄️ **Database configuration** for persistent storage
- 🔒 **SSL/TLS certificates** for secure communication
- 📊 **Analytics integration** for usage tracking

## 🔮 Future Enhancements

### 🚀 Planned Features
- 🔐 **Multi-factor Authentication**: Additional security layers
- 🤖 **Machine Learning Models**: Advanced behavioral analysis
- 🔗 **Integration APIs**: Connect to real EHR systems
- 📱 **Mobile Support**: Responsive design for tablets and mobile devices
- 📋 **Audit Logging**: Comprehensive security event tracking
- 🌐 **Real-time Collaboration**: Multi-user session monitoring

### ⚡ Technical Improvements
- 🔄 **Real-time WebSocket**: Live behavioral data streaming
- 🗄️ **Database Integration**: Persistent user profiles and baselines
- 🔌 **API Development**: RESTful endpoints for external integrations
- ⚡ **Performance Optimization**: Reduced bundle size and improved loading
- 📊 **Advanced Analytics**: Machine learning-powered insights

## 📄 License

This project is an MVP prototype for demonstration purposes. Please ensure compliance with local regulations and security requirements before production use.

## 🤝 Contributing

This is a demonstration project showcasing healthcare security concepts. For production implementations, please consult with security experts and healthcare compliance specialists.

## ⚠️ Important Notes

- 🚫 **No Real Data**: This MVP does not contain real patient data
- 🔒 **Demo Only**: Designed for demonstration and educational purposes
- 🏥 **Healthcare Focus**: Built specifically for clinical environments
- 📋 **Compliance Ready**: Architecture supports HIPAA and healthcare standards

---

**📝 Note**: This MVP is designed for demonstration and educational purposes. It does not contain real patient data or connect to live healthcare systems.
