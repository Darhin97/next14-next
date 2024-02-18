import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); //3600 * 1000 calc num of millisec in an hour

  const existingToken = await getVerificationTokenByEmail(email);

  //delete existing token
  if (existingToken) {
    await db.verificatinToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //generate new token
  const verificationToken = await db.verificatinToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
