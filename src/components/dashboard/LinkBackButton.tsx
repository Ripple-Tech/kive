import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"

interface LinkBackButtonProps {
  href: string
}

export const LinkBackButton = ({ href }: LinkBackButtonProps) => (
  <Link href={href}>
    <Button
      className="w-fit bg-white"
      variant="outline"
    >
      <ArrowLeft className="size-4" />
    </Button>
  </Link>
)
