// src/server/routers/auth-router.ts
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { router } from "../__internals/router"
import { publicProcedure } from "@/server/procedures"

export const dynamic = "force-dynamic"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    const session = await auth()

    if (!session?.user?.id) {
      return c.json({ isSynced: false })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      // Create a minimal persistent user record if missing.
      // Prisma will generate apiKey automatically (cuid()).
      await db.user.create({
        data: {
          id: session.user.id,
          email: session.user.email ?? undefined,
          name: session.user.name ?? undefined,
          image: session.user.image ?? undefined,
          isGuest: false,
        },
      })
    }

    return c.json({ isSynced: true })
  }),
})
