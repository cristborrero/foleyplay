import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      approved?: boolean
      role?: string
    } & DefaultSession["user"]
  }
}
