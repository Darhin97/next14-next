import { auth } from "@/auth";
import { User, UserRole } from "@prisma/client";

export type Usertype = User & {
  role: "ADMIN" | "USER";
  id: string;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

export const currentUser = async () => {
  const session = await auth();

  return session?.user as Usertype;
};

export const currentUserRole = async () => {
  const session = await auth();

  return session?.user.role;
};
