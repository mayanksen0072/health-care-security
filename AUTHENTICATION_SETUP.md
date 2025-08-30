# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# OAuth Providers (Demo - replace with real credentials for production)
GOOGLE_CLIENT_ID=demo-google-client-id
GOOGLE_CLIENT_SECRET=demo-google-client-secret

GITHUB_ID=demo-github-client-id
GITHUB_SECRET=demo-github-client-secret
```

## Demo User Credentials

The system includes pre-configured demo users with the password `password123`:

| Email | Name | Role | Department |
|-------|------|------|------------|
| sarah.johnson@clinic.org | Dr. Sarah Johnson | Physician | Cardiology |
| michael.chen@clinic.org | Dr. Michael Chen | Physician | Neurology |
| emily.rodriguez@clinic.org | Nurse Emily Rodriguez | Nurse | Emergency |
| admin@clinic.org | Admin User | Admin | IT |

## Authentication Features

### 🔐 Multi-Provider Authentication
- **Credentials Provider**: Email/password authentication
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account
- **Biometric Simulation**: Face/fingerprint authentication demo

### 🛡️ Security Features
- **JWT Sessions**: Secure token-based sessions
- **Route Protection**: Middleware protects dashboard routes
- **Session Management**: Automatic session validation
- **Role-Based Access**: User roles and departments

### 🏥 Healthcare-Focused
- **Clinical User Types**: Physicians, Nurses, Admins
- **Department Assignment**: Users assigned to specific departments
- **HIPAA-Ready**: Architecture supports healthcare compliance

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Navigate to /login
   - Use demo credentials to sign in

## Production Deployment

For production deployment:

1. **Generate Secure Secret**
   ```bash
   openssl rand -base64 32
   ```

2. **Configure OAuth Providers**
   - Set up Google OAuth in Google Cloud Console
   - Set up GitHub OAuth in GitHub Developer Settings
   - Update environment variables with real credentials

3. **Database Integration**
   - Replace mock user database with real database
   - Implement user registration and management
   - Add password reset functionality

4. **Security Hardening**
   - Use HTTPS in production
   - Implement rate limiting
   - Add audit logging
   - Configure session timeout policies

## Authentication Flow

1. **Login Page** (`/login`)
   - Choose authentication method (Biometric/Password)
   - Enter credentials or use OAuth providers
   - Validate credentials against user database

2. **Session Creation**
   - Generate JWT token with user information
   - Store session in secure HTTP-only cookie
   - Include user role and department in session

3. **Route Protection**
   - Middleware checks authentication status
   - Redirect unauthenticated users to login
   - Validate session on each request

4. **Dashboard Access**
   - Display user information and role
   - Show department-specific content
   - Provide logout functionality

## Customization

### Adding New OAuth Providers

1. Install provider package
2. Add provider to `authOptions` in `/app/api/auth/[...nextauth]/route.ts`
3. Configure environment variables
4. Update login UI

### Custom User Roles

1. Extend user model with additional roles
2. Update TypeScript types in `/types/next-auth.d.ts`
3. Add role-based UI components
4. Implement role-based route protection

### Database Integration

1. Set up database (PostgreSQL, MySQL, etc.)
2. Install database adapter for NextAuth
3. Replace mock user array with database queries
4. Add user management functionality
