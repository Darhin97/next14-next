"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // some sever stuff before logging user out

  await signOut();
};
