// app/(dashboard)/dashboard/escrow/page.tsx
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Hydrate } from "@/components/hydrate-client"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import getCurrentUser from "@/actions/getCurrentUser"
import { EscrowGridClient } from "./escrow-grid.client"
import { db } from "@/lib/db"
export const dynamic = "force-dynamic"
async function prefetchEscrows(qc: QueryClient, userId: string) {
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

  // 🔑 must match your TRPC query key
  qc.setQueryData(["escrow.listMine", { limit: 20 }], {
    items: escrows,
    nextCursor: null,
  })

  return dehydrate(qc)
}

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) redirect("/login") // ✅ protection

  const qc = new QueryClient()
  const state = await prefetchEscrows(qc, user.id)

  return (
    <DashboardPage title="Your Escrows" hideBackButton showCreate>
      <Hydrate state={state}>
        <EscrowGridClient />
      </Hydrate>
    </DashboardPage>
  )
}
