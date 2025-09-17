"use server"

import { db } from "@/lib/db"
import { QueryClient } from "@tanstack/react-query"
import { fetchCurrentUser } from "@/lib/fetchCurrentUser" // <- use your new version

export async function prefetchDashboard(qc: QueryClient) {
  const user = await fetchCurrentUser()
  if (!user) return

  const escrows = await db.escrow.findMany({
    where: { OR: [{ creatorId: user.id }, { buyerId: user.id }, { sellerId: user.id }] },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
    },
  })

  qc.setQueryData(["escrow.listMine", { limit: 20 }], { items: escrows, nextCursor: null })
}

export async function prefetchTransactions(qc: QueryClient) {
  const user = await fetchCurrentUser()
  if (!user) return

  const txns = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  qc.setQueryData(["transactions.list", { limit: 20 }], txns)
}

export async function prefetchProfile(qc: QueryClient) {
  const user = await fetchCurrentUser()
  if (!user) return

  const profile = await db.user.findUnique({
    where: { id: user.id },
  })

  qc.setQueryData(["profile", { userId: user.id }], profile)
}
