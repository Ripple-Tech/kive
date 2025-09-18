"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { EscrowDetail } from "./escrow-detail"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import EscrowCompleteEmptyState from "./EmptyEscrow"

export function EscrowDetailClient({ id }: { id: string }) {
  const qc = useQueryClient()
  const router = useRouter()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const {
    data: escrow,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["escrow.byId", { id }], // ✅ matches prefetch
    queryFn: async () => {
      const res = await client.escrow.getById.$get({ id })
      const payload = await res.json()
      return payload.escrow // ✅ normalize to raw escrow
    },
    staleTime: 30_000,
    retry: (failureCount, err: any) => {
      if (err?.status === 401 || err?.status === 403) return false
      return failureCount < 2
    },
  })

  const [showMinimalAccept, setShowMinimalAccept] = useState(false)

  const accept = useMutation({
    mutationFn: async (vars: { escrowId: string }) => {
      const res = await client.escrow.acceptInvitation.$post(vars)
      return await res.json()
    },
    onSuccess: async () => {
      setShowMinimalAccept(false)

      await Promise.all([
        qc.invalidateQueries({ queryKey: ["escrow.byId", { id }] }),
        qc.invalidateQueries({ queryKey: ["escrow.listMine"] }),
      ])

      refetch()
      router.refresh()
    },
  })

  useEffect(() => {
    if (isError && (error as any)?.status === 403) {
      setShowMinimalAccept(true)
    }
  }, [isError, error])

  if (showMinimalAccept) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Join Escrow</h2>
        <p className="text-gray-600">You have been invited to join this escrow. Accept to proceed.</p>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={() => accept.mutate({ escrowId: id })}
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

  const displayRole = isCreator
    ? escrow.role
    : escrow.role === "BUYER"
    ? "SELLER"
    : "BUYER"

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
              onClick={() => accept.mutate({ escrowId: id })}
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
