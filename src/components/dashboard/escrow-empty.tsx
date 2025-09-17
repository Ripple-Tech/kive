import HeroForm from "@/components/forms/heroform";

export function EscrowEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 py-15">
      <p className="text-lg font-medium">No escrows yet</p>
      <p className="text-sm mb-10">Create your first escrow to get started.</p>
      <HeroForm inDashboard/>
    </div>
  )
}