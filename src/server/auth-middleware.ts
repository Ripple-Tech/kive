// src/server/auth-middleware.ts
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { HTTPException } from "hono/http-exception"
import { j } from "./__internals/j"

export const authMiddleware = j.middleware(async ({ c, next }) => {
  // --- API Key flow (for sellers calling via external API) ---
  const authHeader = c.req.header("Authorization")
  if (authHeader) {
    const apiKey = authHeader.split(" ")[1] // "Bearer <API_KEY>"
    const user = await db.user.findUnique({ where: { apiKey } })
    if (user) return next({ user })
  }

  // --- NextAuth session flow ---
  const session = await auth()
  if (!session?.user?.id) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return next({ user })
})
