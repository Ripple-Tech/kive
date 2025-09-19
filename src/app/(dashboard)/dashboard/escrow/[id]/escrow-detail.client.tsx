// dashboard/escrow/[id]/escrow-detail.client.tsx
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { EscrowDetail } from "./escrow-detail"
import { useSession } from "next-auth/react"
import { useState, useMemo } from "react"
import EscrowCompleteEmptyState from "./EmptyEscrow"

export function EscrowDetailClient({ id }: { id: string }) {
  const qc = useQueryClient()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // Ensure stable, non-empty id for first render
  const stableId = useMemo(() => id ?? "", [id])
  if (!stableId) return <div>Invalid escrow id.</div>

  const {
    data: escrow,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    // ❗ EXACT same key as server prefetch / page.setQueryData
    queryKey: ["escrow.byId", stableId],
    // If cache exists (hydrated from server), queryFn will not run thanks to refetchOnMount:false
    queryFn: async () => {
      // Extra guard: return cached immediately if present to avoid calling protected API
      const cached = qc.getQueryData(["escrow.byId", stableId])
      if (cached) return cached

      // Fallback: call the hono client endpoint and parse response
      const res = await client.escrow.getById.$get({ id: stableId })
      // client returns a Response-like object with .json overriden in baseClient; parse it
      const payload = await (res as any).json()
      // server returns { escrow: {...} }
      return payload?.escrow ?? payload
    },
    enabled: Boolean(stableId),
    staleTime: 30_000,               // keep cache "fresh" for 30s (no refetch on mount during that time)
    refetchOnMount: false,          // don't force a refetch when component mounts (important for hydration)
    refetchOnWindowFocus: false,    // avoid refetches when user tabs away/back
    retry: (failureCount, err: any) => {
      // don't retry unauthorized/forbidden
      if (err?.status === 401 || err?.status === 403) return false
      return failureCount < 2
    },
  })

  const [showMinimalAccept, setShowMinimalAccept] = useState(false)

  const accept = useMutation({
    mutationFn: async (vars: { escrowId: string }) => {
      const res = await client.escrow.acceptInvitation.$post(vars)
      const payload = await (res as any).json()
      return payload
    },
    onSuccess: async () => {
      // reset fallback UI
      setShowMinimalAccept(false)

      // invalidate matching keys (primitive id)
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["escrow.byId", stableId] }),
        qc.invalidateQueries({ queryKey: ["escrow.listMine"] }),
      ])

      // optional: refetch detail immediately
      refetch()
    },
  })

  // if the server returned 403 we may want to show the minimal accept UI
  if (isError && (error as any)?.status === 403) {
    setShowMinimalAccept(true)
  }

  if (showMinimalAccept) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Join Escrow</h2>
        <p className="text-gray-600">
          You have been invited to join this escrow. Accept to proceed.
        </p>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={() => accept.mutate({ escrowId: stableId })}
          disabled={accept.isPending}
        >
          {accept.isPending ? "Joining…" : "Accept invitation"}
        </button>
      </div>
    )
  }

  if (isLoading) return <div>Loading escrow…</div>
  if (isError || !escrow) return <div>Unable to load escrow.</div>

  const isCreator = escrow.creatorId === currentUserId
  const isBuyer = escrow.buyerId === currentUserId
  const isSeller = escrow.sellerId === currentUserId
  const isParticipant = isCreator || isBuyer || isSeller

  const isComplete = Boolean(escrow.buyerId && escrow.sellerId)

  if (isComplete && !isParticipant) {
    return <EscrowCompleteEmptyState />
  }

  const displayRole = isCreator ? escrow.role : escrow.role === "BUYER" ? "SELLER" : "BUYER"
  const needsJoin = !isParticipant && !isComplete && escrow.invitationStatus === "PENDING"

  return (
    <div className="space-y-4">
      {needsJoin ? (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">You have been invited to this escrow</div>
              <div className="text-sm text-gray-600">
                Accept to join and start the conversation with your counterparty.
              </div>
            </div>
            <button
              className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              onClick={() => accept.mutate({ escrowId: stableId })}
              disabled={accept.isPending}
            >
              {accept.isPending ? "Joining…" : "Accept invitation"}
            </button>
          </div>
        </div>
      ) : null}

      <EscrowDetail escrow={escrow} displayRole={displayRole} isCreator={isCreator} />
    </div>
  )
}
