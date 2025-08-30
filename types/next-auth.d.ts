import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: string
      department: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    role: string
    department: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    department: string
  }
}
