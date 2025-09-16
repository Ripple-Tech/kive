"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LucidePanelLeftClose } from "lucide-react";
import { Poppins } from "next/font/google";
import { Modal } from "../ui/modal";
import { Separator } from "../ui/separator";
import { useSession, signOut } from "next-auth/react";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    onOpenChange(false);
    // Trigger client-side sign out and redirect to home (adjust if needed
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Modal showModal={open} setShowModal={onOpenChange}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Link href={"/"} onClick={() => onOpenChange(false)} className="flex gap-3 items-center">
          <Image src="/logo.png" alt="Logo" width={34} height={34} className="size-12" />
          <span className={cn("text-2xl font-bold text-primary", poppins.className)}>KYVE</span>
        </Link>
      </div>

      {/* Sidebar nav items */}
      <div className="flex flex-col py-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full text-left p-4 font-medium text-base transition-colors",
                isActive ? "bg-primary text-white" : "text-gray-800 hover:bg-primary hover:text-white"
              )}
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          );
        })}
      </div>

      <Separator className="mx-auto w-24 bg-black/10" />

      {/* Auth buttons */}
      {status === "loading" ? null : session?.user ? (
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left p-4 flex items-center font-medium text-gray-800 hover:bg-primary hover:text-white text-base border-t"
        >
          <LucidePanelLeftClose className="h-6 w-6 mr-2" />
          Logout
        </button>
      ) : (
        <div className="border-t">
          <Link
            href="/auth/login"
            onClick={() => onOpenChange(false)}
            className="w-full text-left p-4 flex items-center font-medium text-gray-800 hover:bg-primary hover:text-white text-base"
          >
            Log In
          </Link>
          <Link
            href="/auth/register"
            onClick={() => onOpenChange(false)}
            className="w-full text-left p-4 flex items-center font-medium text-gray-800 hover:bg-primary hover:text-white text-base"
          >
            Sign Up
          </Link>
        </div>
      )}
    </Modal>
  );
};