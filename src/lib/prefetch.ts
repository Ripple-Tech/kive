// src/lib/prefetch.ts
"use server";

import { db } from "@/lib/db";
import { QueryClient } from "@tanstack/react-query";
import getCurrentUser from "@/actions/getCurrentUser";

/**
 * Prefetch helpers — these accept userId (so they remain pure & testable).
 * Keys must match whatever the client useQuery keys are.
 */

/** seed the dashboard list (your user escrows) */
export async function prefetchDashboard(qc: QueryClient, userId: string) {
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
  });

  qc.setQueryData(["escrow.listMine", { limit: 20 }], {
    items: escrows,
    nextCursor: null,
  });
}

/** seed the transactions list for the given user */
export async function prefetchTransactions(qc: QueryClient, userId: string) {
  const txns = await db.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  qc.setQueryData(["transactions.list", { limit: 20 }], txns);
}

/** seed the profile for the given user */
export async function prefetchProfile(qc: QueryClient, userId: string) {
  const profile = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      // include whatever fields your UI expects
    },
  });

  qc.setQueryData(["profile", { userId }], profile);
}

/** seed a single escrow detail (key must match client) */
export async function prefetchEscrow(qc: QueryClient, id: string) {
  const escrow = await db.escrow.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true } },
      creator: { select: { id: true, name: true } },
    },
  });

  if (escrow) {
    // NOTE: client uses ["escrow.byId", { id }] as the key
    qc.setQueryData(["escrow.byId", { id }], escrow);
  }
}

/**
 * Convenience: call getCurrentUser() once and prefetch the common datasets.
 * Use this from server page components (where you want to pre-seed react-query).
 */
export async function prefetchAllForCurrentUser(qc: QueryClient) {
  const user = await getCurrentUser();
  if (!user) return null;

  // run in parallel
  await Promise.all([
    prefetchDashboard(qc, user.id),
    prefetchTransactions(qc, user.id),
    prefetchProfile(qc, user.id),
  ]);

  return null;
}
