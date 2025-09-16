// src/server/router/escrow-router.ts
import { db } from "@/lib/db"
import { router } from "../__internals/router"
import { privateProcedure } from "@/server/procedures"
import { ESCROW_VALIDATOR } from "@/lib/validators/escrow-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

/**
 * Maps received client values to your Prisma enum values.
 * Clients send lower-case values for convenience; we convert to uppercase enums.
 */
const roleMap = { buyer: "BUYER", seller: "SELLER" } as const
const logisticsMap = { no: "NO", pickup: "PICKUP", delivery: "DELIVERY" } as const

export const escrowRouter = router({
  // Create escrow (internal UI + external API callers; auth handled by privateProcedure)
  createEscrow: privateProcedure
    .input(ESCROW_VALIDATOR)
    .mutation(async ({ ctx, input, c }) => {
      if (input.receiverId && input.receiverId === ctx.user.id) {
        throw new HTTPException(400, {
          message: "Creator (sender) and receiver cannot be the same user.",
        })
      }

      // Normalize amount (accept "1,000" or 1000)
      let amountNumber: number
      if (typeof input.amount === "string") {
        const cleaned = input.amount.replace(/[, ]+/g, "")
        amountNumber = Number(cleaned)
        if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
          throw new HTTPException(400, { message: "Invalid amount" })
        }
      } else {
        amountNumber = input.amount
      }

      // Determine initial assignment
      const creatorIsBuyer = input.role === "buyer"
      const buyerId = creatorIsBuyer ? ctx.user.id : undefined
      const sellerId = creatorIsBuyer ? undefined : ctx.user.id
      const invitedRole = creatorIsBuyer ? "SELLER" : "BUYER" as const

      const escrow = await db.escrow.create({
        data: {
          role: roleMap[input.role ?? "seller"],
          category: input.category,
          logistics: logisticsMap[input.logistics],
          amount: amountNumber,
          currency: input.currency as any,
          status: (input.status as any) ?? "PENDING",
          source: "INTERNAL",

          // Product fields
          productName: input.productName,
          description: input.description ?? undefined,
          photoUrl: input.photoUrl ?? undefined,
          color: input.color ?? undefined,

          // Invitation flow
          invitedRole,
          invitationStatus: "PENDING",

          // Relations
          creatorId: ctx.user.id,
          buyerId,
          sellerId,
        },
        select: {
          id: true,
          status: true,
          invitedRole: true,
          buyerId: true,
          sellerId: true,
          creatorId: true,
        },
      })

      // Build share link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      const shareUrl = `${baseUrl.replace(/\/$/, "")}/escrow/${escrow.id}`

      return c.superjson({ ...escrow, shareUrl })
    }),

  // Accept invitation
  acceptInvitation: privateProcedure
    .input(z.object({ escrowId: z.string().min(1) }))
    .mutation(async ({ ctx, input, c }) => {
      const escrow = await db.escrow.findUnique({
        where: { id: input.escrowId },
        select: {
          id: true,
          invitedRole: true,
          invitationStatus: true,
          buyerId: true,
          sellerId: true,
          creatorId: true,
        },
      })

      if (!escrow) throw new HTTPException(404, { message: "Escrow not found" })

      if (escrow.creatorId === ctx.user.id) {
        throw new HTTPException(403, { message: "Creator cannot accept own escrow" })
      }

      // If already participant
      if (escrow.buyerId === ctx.user.id || escrow.sellerId === ctx.user.id) {
        await db.escrow.update({
          where: { id: input.escrowId },
          data: { invitationStatus: "ACCEPTED" },
        })
        return c.superjson({ success: true, escrowId: escrow.id })
      }

      // Attach user
      const needsBuyer = !escrow.buyerId
      const needsSeller = !escrow.sellerId

      if (needsSeller) {
        await db.escrow.update({
          where: { id: input.escrowId },
          data: { sellerId: ctx.user.id, invitationStatus: "ACCEPTED" },
        })
      } else if (needsBuyer) {
        await db.escrow.update({
          where: { id: input.escrowId },
          data: { buyerId: ctx.user.id, invitationStatus: "ACCEPTED" },
        })
      } else {
        // Both already set
        await db.escrow.update({
          where: { id: input.escrowId },
          data: { invitationStatus: "ACCEPTED" },
        })
      }

      return c.superjson({ success: true, escrowId: escrow.id })
    }),

  // Decline invitation
  declineInvitation: privateProcedure
    .input(z.object({ escrowId: z.string().min(1) }))
    .mutation(async ({ ctx, input, c }) => {
      await db.escrow.update({
        where: { id: input.escrowId },
        data: { invitationStatus: "DECLINED" },
      })
      return c.superjson({ success: true })
    }),

  // Get escrow detail (only creator, buyer, seller)
  getById: privateProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input, c }) => {
      const escrow = await db.escrow.findUnique({
        where: { id: input.id },
        include: {
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
        },
      })

      if (!escrow) throw new HTTPException(404, { message: "Escrow not found" })

      const userId = ctx.user.id
      const isParticipant =
        escrow.creatorId === userId ||
        escrow.buyerId === userId ||
        escrow.sellerId === userId

      if (!isParticipant) {
        throw new HTTPException(403, { message: "Not allowed" })
      }

      return c.superjson({ escrow })
    }),

// Paginated listing (20 default)
listMine: privateProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().nullish(),
    })
  )
  .query(async ({ ctx, input, c }) => {
    const limit = input.limit ?? 20
    const cursor = input.cursor ?? undefined

    const items = await db.escrow.findMany({
      where: {
        OR: [
          { creatorId: ctx.user.id },
          { buyerId: ctx.user.id },
          { sellerId: ctx.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // `skip: 1` prevents including the cursor item again
      include: {
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    })

    let nextCursor: string | undefined = undefined
    if (items.length > limit) {
      const next = items.pop()! // remove the extra item
      nextCursor = next.id
    }

    return c.superjson({ items, nextCursor })
  }),
})
