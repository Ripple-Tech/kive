import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ESCROW_VALIDATOR } from "@/lib/validators/escrow-validator";

// Force dynamic runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // --- API key flow (for external sellers calling directly) ---
    const authHeader = req.headers.get("Authorization");
    let appUser: { id: string } | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const apiKey = authHeader.split(" ")[1];
      const userByApiKey = await db.user.findUnique({
        where: { apiKey },
        select: { id: true },
      });
      if (userByApiKey) {
        appUser = { id: userByApiKey.id };
      }
    }

    // --- NextAuth session flow (for internal web users) ---
    if (!appUser) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      appUser = { id: user.id };
    }

    // --- Parse request body ---
    let requestData: unknown;
    try {
      requestData = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const input = ESCROW_VALIDATOR.parse(requestData);

    // --- Prevent self-escrow ---
    if (input.receiverId && input.receiverId === appUser.id) {
      return NextResponse.json(
        { message: "Sender and receiver cannot be the same user" },
        { status: 400 }
      );
    }

    // --- Create escrow ---
    const escrow = await db.escrow.create({
      data: {
        productName: input.productName,
        description: input.description,
        photoUrl: input.photoUrl,
        color: input.color,
        category: input.category,
        logistics: input.logistics?.toUpperCase() as any,
        amount: Number(input.amount), // store as number/Decimal
        currency: input.currency,
        status: input.status ?? ("PENDING" as any), // Cast to any or EscrowStatus if imported
        role: input.role.toUpperCase() as any,
        // relations
        creatorId: appUser.id,
        sellerId: input.role === "seller" ? appUser.id : input.receiverId ?? null,
        buyerId: input.role === "buyer" ? appUser.id : input.receiverId ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Escrow created successfully",
        escrowId: escrow.id,
        escrow,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Escrow API error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", issues: err.issues },
        { status: 422 }
      );
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
