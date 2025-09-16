import { z } from "zod";

export const ESCROW_VALIDATOR = z.object({
  productName: z.string(),
  category: z.string(),
  logistics: z.enum(["no", "pickup", "delivery"]), // REQUIRED
  amount: z.union([z.string(), z.number()]),
  currency: z.enum(["NGN", "USD", "GHS"]),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  color: z.string().optional(),
  role: z.enum(["buyer", "seller"]),
  receiverId: z.string().optional(),
  receiverEmail: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
});