"use client"

import { format } from "date-fns"
import { ArrowRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

interface EscrowCardProps {
  escrow: {
    id: string
    category: string
    role: string
    amount: number
    currency: string
    status: string
    createdAt: Date
  }
  onDelete: (id: string) => void
}

export function EscrowCard({ escrow, onDelete }: EscrowCardProps) {
  return (
    <li className="relative group transition-all duration-200 hover:-translate-y-0.5">
      <div className="absolute z-0 inset-px rounded-lg bg-white" />
      <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5" />

      <div className="relative p-6 space-y-4 z-10">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{escrow.category}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(escrow.createdAt), "MMM d, yyyy")}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium">Role:</span> {escrow.role}</p>
          <p><span className="font-medium">Amount:</span> {escrow.amount} {escrow.currency}</p>
          <p><span className="font-medium">Status:</span> {escrow.status}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/dashboard/escrow/${escrow.id}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2 text-sm",
            })}
          >
            View <ArrowRight className="size-4" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600 transition-colors"
            onClick={() => onDelete(escrow.id)}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>
    </li>
  )
}