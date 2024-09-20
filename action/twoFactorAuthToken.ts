"use server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorConfiramationByUserID = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twofactorConfirmation.findUnique({
      where: { userId },
    });
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};

export const createTwoFactorAuthToken = async (email: string) => {
  const token = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};
