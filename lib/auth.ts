import { auth } from "@/auth";
import { User, UserRole } from "@prisma/client";

export const currentUser = async () => {
  const session = await auth();

  return session?.user as User;
};

export const currentUserRole = async () => {
  const session = await auth();

  return session?.user.role;
};
