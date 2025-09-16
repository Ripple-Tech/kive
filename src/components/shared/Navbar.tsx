"use client"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react";
import { NavbarSidebar } from "@/components/shared/Navbar-Sidebar"
import { UserAvatar } from "@/components/UserAvatar"

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

interface NavbarItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
}

const NavbarItems = [
  { children: "Home", href: "/" },
  { children: "Dashboard", href: "/dashboard" },
  { children: "About", href: "/about" },
  { children: "Buyers", href: "/buyers" },
  { children: "Sellers", href: "/sellers" },
  
]

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
   
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "text-lg px-3.5 bg-black hover:bg-primary hover:text-white rounded-full hover:border-primary border-transparent font-semibold text-white",
        isActive &&
          "text-white bg-primary hover:bg-white hover:text-black"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export const Navbar = () => {
  const pathname = usePathname()
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <nav className="flex h-20 border-b justify-between px-2  bg-white">
      <Link
        href={"/"}
        className="pl-4 md:pl-5 flex gap-4 md:gap-6 items-center"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={34}
          height={34}
          className="size-14"
        />

        {/* Brand with stacked text */}
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              // Use the 'text-primary' class instead of a hardcoded hex value.
              "text-3xl md:text-4xl font-bold text-black",
              poppins?.className ?? ""
            )}
          >
            KYVE
          </span>
          <span
            className={cn(
              "text-sm md:text-base text-center uppercase tracking-wide -mb-1 text-primary",
              poppins?.className ?? ""
            )}
            aria-hidden="true"
          >
            Your Digital Shield
          </span>
        </div>
      </Link>
  <NavbarSidebar items={NavbarItems} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
      <div className="items-center hidden gap-4 pr-6 lg:flex">
        {NavbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      <div className="hidden lg:flex">
       {status === "loading" ? null : session?.user ? (
          <UserAvatar user={session.user} />
        ) : (
          <>
        <Button
          asChild
          variant="secondary"
          className="text-lg px-10 h-full border-l border-t-0 border-r-0 bg-transparent hover:bg-primary transition-colors rounded-none font-semibold text-gray-800 hover:text-black"
        >
          <Link href="/auth/login">Log in</Link>
        </Button>
        <Button
          asChild
          className="text-lg px-10 h-full border-l border-t-0 border-r-0 bg-primary hover:bg-white transition-colors rounded-none font-semibold text-black hover:text-gray-800"
        >
          <Link href="/auth/register">Sign Up</Link>
        </Button>
        </>
        )}
      </div>

      <div className="flex lg:hidden items-center justify-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1 border border-gray-300 rounded-md bg-transparent hover:bg-gray-100"
        >
          <MenuIcon color="black" className="w-8 h-8" />
        </button>
      </div>
    </nav>
  )
}
