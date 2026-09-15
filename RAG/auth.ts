import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ username: z.string().min(1), password: z.string().min(1) })
          .safeParse(credentials)

        if (!parsed.success) return null

        const { username, password } = parsed.data
        const adminUsername = process.env.ADMIN_USERNAME
        const adminHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminUsername || !adminHash) return null
        if (username !== adminUsername) return null

        const valid = await bcrypt.compare(password, adminHash)
        if (!valid) return null

        return { id: "1", name: adminUsername }
      },
    }),
  ],
})
