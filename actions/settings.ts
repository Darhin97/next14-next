"use server";
import * as z from "zod";
import { SettingScheme } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingScheme>) => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  //check if user exist in db
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return {
      error: "Unauthorized",
    };
  }

  //if user is OAuth
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnable = undefined;
  }

  //changing email
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return {
        error: "Email already in use!",
      };
    }
    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Verification email sent" };
  }

  //changing password
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordMatch) {
      return {
        error: "Incorrect password!",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });

  return {
    success: "Settings updated",
  };
};
