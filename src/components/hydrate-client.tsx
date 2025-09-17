"use client"

import { HydrationBoundary, DehydratedState } from "@tanstack/react-query"

export function Hydrate({ state, children }: { state: DehydratedState; children: React.ReactNode }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>
}