"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import { LucidePanelLeftClose } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  const handleLogout = async () => {
    // Trigger client-side sign out and redirect to home (adjust if needed
    await signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer h-13 w-13">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 p-2" align="end">
       
        <DropdownMenuItem asChild>
           <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left p-4 flex items-center font-medium text-gray-800 hover:bg-primary hover:text-white text-base border-t"
        >
          <LucidePanelLeftClose className="h-6 w-6 mr-2" />
          Logout
        </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
