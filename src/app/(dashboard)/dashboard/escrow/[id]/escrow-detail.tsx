import { IoCopyOutline } from "react-icons/io5"
import { format } from "date-fns"
import { useState } from "react"

interface EscrowDetailProps {
  escrow: any
  displayRole: string
   isCreator: boolean
}

export function EscrowDetail({ escrow, displayRole, isCreator }: EscrowDetailProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/escrow/${escrow.id}`

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed", err)
      alert("Failed to copy link.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold">Escrow Details</h2>
      <p className="text-gray-500">ID: {escrow.id}</p>

      <div className="divide-y divide-gray-200">
        <div className="py-2 flex justify-between">
          <span className="font-medium">Category</span>
          <span>{escrow.category}</span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="font-medium">Role</span>
          <span>{displayRole}</span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="font-medium">Amount</span>
          <span>
            {escrow.amount} {escrow.currency}
          </span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="font-medium">Status</span>
          <span>{escrow.status}</span>
        </div>
        <div className="py-2 flex justify-between">
          <span className="font-medium">Created</span>
          <span>{format(new Date(escrow.createdAt), "PPpp")}</span>
        </div>

        {/* 🔒 Sharable link — show only if creator */}
        {isCreator && (
          <div className="py-2 flex justify-between items-center">
            <span className="font-medium">Sharable Link</span>
            <div className="flex items-center gap-2 max-w-[60%] sm:max-w-[70%]">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm truncate"
              >
                {shareUrl}
              </a>
              <button
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleCopy(shareUrl)}
              >
                <IoCopyOutline size={18} />
                {copied ? <span className="text-green-600">Copied!</span> : null}
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}
