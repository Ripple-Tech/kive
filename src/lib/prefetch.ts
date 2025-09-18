"use server"

import { db } from "@/lib/db"
import { QueryClient } from "@tanstack/react-query"
import  getCurrentUser from "@/actions/getCurrentUser" // <- use your new version

export async function prefetchDashboard(qc: QueryClient, userId: string) {
  const escrows = await db.escrow.findMany({
    where: {
      OR: [{ creatorId: userId }, { buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
    },
  })

  qc.setQueryData(["escrow.listMine", { limit: 20 }], {
    items: escrows,
    nextCursor: null,
  })
}


export async function prefetchTransactions(qc: QueryClient) {
  const user = await getCurrentUser()
  if (!user) return

  const txns = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  qc.setQueryData(["transactions.list", { limit: 20 }], txns)
}

export async function prefetchProfile(qc: QueryClient) {
  const user = await getCurrentUser()
  if (!user) return

  const profile = await db.user.findUnique({
    where: { id: user.id },
  })

  qc.setQueryData(["profile", { userId: user.id }], profile)
}

// ✅ use the same key as client: ["escrow.byId", { id }]
export async function prefetchEscrow(qc: QueryClient, id: string) {
  const escrow = await db.escrow.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
    },
  })

  if (escrow) {
    // always store the raw escrow object
    qc.setQueryData(["escrow.byId", { id }], escrow)
  }
}
