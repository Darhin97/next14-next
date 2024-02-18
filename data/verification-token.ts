import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificatinToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch (e) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificatinToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (e) {
    return null;
  }
};
