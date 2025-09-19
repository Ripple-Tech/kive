import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { EscrowDetailClient } from "./escrow-detail.client"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

interface EscrowDetailPageProps {
  params: { id: string }
}

export default async function EscrowDetailPage({ params }: EscrowDetailPageProps) {
  

  const awaitedParams = await params
  const id = awaitedParams.id

  const session = await auth()
  if (!session?.user?.id) return redirect("/auth/login")

  const escrow = await db.escrow.findUnique({
    where: { id: awaitedParams.id },
    include: {
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  })

  if (!escrow) return notFound()

  const qc = getQueryClient()

  // ✅ seed initialData like old guide
  qc.setQueryData(["escrow.byId", { id: awaitedParams.id }], escrow)

  return (
    <DashboardPage title="Escrow Details" linkBackTo="/dashboard/escrow">
      <HydrationBoundary state={dehydrate(qc)}>
        <EscrowDetailClient id={awaitedParams.id} />
      </HydrationBoundary>
    </DashboardPage>
  )
}