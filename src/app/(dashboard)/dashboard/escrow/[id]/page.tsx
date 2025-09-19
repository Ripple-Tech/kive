import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { EscrowDetailClient } from "./escrow-detail.client"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

interface EscrowDetailPageProps {
  // ✅ Prefer plain object
  params: { id: string } | Promise<{ id: string }>
}

// If you must keep Promise in your project, ensure it always resolves to the same id string
// and that EscrowDetailClient receives a non-empty string on first render.

export default async function EscrowDetailPage({ params }: EscrowDetailPageProps) {
  // ✅ Always await if params is a Promise
  const resolvedParams = await params
  const id = resolvedParams.id
  if (!id) return notFound()

  const session = await auth()
  if (!session?.user?.id) return redirect("/auth/login")

  const escrow = await db.escrow.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  })

  if (!escrow) return notFound()

  const qc = getQueryClient()
  // ✅ Use primitive key instead of object to avoid hydration mismatch
  qc.setQueryData(["escrow.byId", id], escrow)

  return (
    <DashboardPage title="Escrow Details" linkBackTo="/dashboard/escrow">
      <HydrationBoundary state={dehydrate(qc)}>
        <EscrowDetailClient id={id} />
      </HydrationBoundary>
    </DashboardPage>
  )
}
