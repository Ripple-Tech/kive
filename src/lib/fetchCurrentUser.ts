export async function fetchCurrentUser() {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      : ""

  const res = await fetch(`${baseUrl}/api/user`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}
