// app/(dashboard)/dashboard/page.tsx
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { Hydrate } from "@/components/hydrate-client"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import getCurrentUser from "@/actions/getCurrentUser"
import { prefetchDashboard } from "@/lib/prefetch"
import Transaction from "@/components/dashboard/Transactions"

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login") // ✅ protect + redirect, faster than null

  // ✅ Server-side prefetch
  const qc = new QueryClient()
  await prefetchDashboard(qc)
  const state = dehydrate(qc)

  return (
    <DashboardPage title="Your Escrows" hideBackButton showCreate isDashboard>
      <Hydrate state={state}>
        <Transaction />
      </Hydrate>
    </DashboardPage>
  )
}
