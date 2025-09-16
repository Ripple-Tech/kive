import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession} from "next-auth";
import "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  username: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isChatEnabled: boolean;
  isOAuth: boolean;
  balance: Float;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

