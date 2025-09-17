import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export const GET = async () => {
  // use next-auth server helper
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, balance: true, email: true },
  })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}
