function EscrowCompleteEmptyState() {
  return (
    <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-lg shadow">
      {/* SVG Illustration */}
      <svg
        className="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 48 48"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20v-4a8 8 0 0116 0v4m-8 8h.01M4 20h40M8 20v20a4 4 0 004 4h24a4 4 0 004-4V20"
        />
      </svg>

      <h2 className="mt-6 text-lg font-semibold text-gray-900">
        Escrow already completed
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        This escrow already has both a buyer and a seller.  
        Only participants can access it.
      </p>
    </div>
  )
}
export default EscrowCompleteEmptyState