"use server"

import { db } from "@/lib/db"
import getCurrentUser from "@/actions/getCurrentUser"

export async function deleteEscrowAction(escrowId: string) {
  const sessionUser = await getCurrentUser()
  if (!sessionUser?.id) throw new Error("Unauthorized")

  const escrow = await db.escrow.findUnique({
    where: { id: escrowId },
    select: { creatorId: true },
  })

  if (!escrow || escrow.creatorId !== sessionUser.id) {
    throw new Error("Not allowed")
  }

  await db.escrow.delete({
    where: { id: escrowId },
  })

  return { success: true }
}