// app/(dashboard)/dashboard/page.tsx
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Hydrate } from "@/components/hydrate-client"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import getCurrentUser from "@/actions/getCurrentUser"   // ✅ server-only
import { prefetchDashboard } from "@/lib/prefetch"
import Transaction from "@/components/dashboard/Transactions"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"  // ✅ auth page must be dynamic

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")  // ✅ your preference saved!

  const qc = new QueryClient()
  await prefetchDashboard(qc, user.id)  // pass user.id from server auth
  const state = dehydrate(qc)

  return (
    <DashboardPage title="Your Escrows" hideBackButton showCreate isDashboard>
      <Hydrate state={state}>
        <Transaction />
      </Hydrate>
    </DashboardPage>
  )
}
