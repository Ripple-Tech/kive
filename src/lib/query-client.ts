import { QueryClient } from "@tanstack/react-query"

// 🟢 fresh QueryClient each time on server
export function getQueryClient() {
  return new QueryClient()
}
