// app/(dashboard)/dashboard/escrow/[id]/page.tsx
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { EscrowDetailClient } from "./escrow-detail.client"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"

// NOTE: Next may pass params as a Promise. Explicitly accept a Promise here
// and await it. This avoids the Next.js runtime warning and TypeScript build issues.
export default async function EscrowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Always await params (Next runtime may be async).
  const resolved = await params
  const id = resolved?.id
  if (!id) return notFound()

  // server-side auth check
  const session = await auth()
  if (!session?.user?.id) return redirect("/auth/login")

  // Fetch directly from DB on server (fast and avoids hitting protected /api)
  const escrow = await db.escrow.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  })

  if (!escrow) return notFound()

  const qc = getQueryClient()

  // IMPORTANT: use a primitive id in the key to avoid hydration mismatch.
  // This must match the client queryKey exactly.
  qc.setQueryData(["escrow.byId", id], escrow)

  return (
    <DashboardPage title="Escrow Details" linkBackTo="/dashboard/escrow">
      <HydrationBoundary state={dehydrate(qc)}>
        <EscrowDetailClient id={id} />
      </HydrationBoundary>
    </DashboardPage>
  )
}
