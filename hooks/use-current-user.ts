import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { Usertype } from "@/lib/auth";

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user as Usertype;
};
