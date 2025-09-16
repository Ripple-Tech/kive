"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { bottomNavItems } from "@/components/shared/BottomNav" 
import { LogoutButton } from "@/components/auth/logout-button"
import { LucidePanelLeftClose } from "lucide-react"

const LeftSidebar = () => {
  const pathname = usePathname()

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 pb-5 pt-28 max-md:hidden">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (pathname.includes(href) && href.length > 1) || pathname === href

          return (
            <Link
              href={href}
              key={label}
              className={`relative flex justify-start gap-4 rounded-lg p-4 ${
                isActive ? "bg-primary text-grey-800" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <p className=" text-muted-foreground max-lg:hidden">
                {label}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <LogoutButton>
          <LucidePanelLeftClose className="h-6 w-6 mr-2" />
        </LogoutButton>
      </div>
    </section>
  )
}

export default LeftSidebar
