"use server";

import { z } from "zod";
import { NewPasswordSchema, ResetSchema } from "../schemas";
import { getCurentUserEmail } from "./user-action";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordReseetEmail } from "@/lib/mail";
import { randarError } from "./common";
import bcrypt from "bcryptjs";

export const newPasswordAction = async (
token: string, values: z.infer<typeof NewPasswordSchema>) => {

  if (!token) {
    return { error: true, message: "Token does not exist" };
  }

  const validate = NewPasswordSchema.safeParse(values);
  if (!validate.success) {
    return { error: true, message: "Invalid Password" };
  }

  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken) {
    return { error: true, message: "Token does not exist" };
  }
  const { password } = validate.data;

  let expirationDate = existingToken.expiresAt
    ? new Date(existingToken.expiresAt)
    : undefined;
  const currentDate = new Date();
  try {
    expirationDate = new Date(existingToken.expiresAt);
    console.log("Parsed Expiration Date:", expirationDate);
  } catch (e) {
    console.error("Error parsing expiration date:", e);
  }

  if (expirationDate) {
    const hasExpired = expirationDate < currentDate;
    if (hasExpired) {
      return {
        message: "Token has expired",
        error: true,
      };
    }
  } else {
    console.error("Expiration date is undefined");
  }

  const existingEmail = await getCurentUserEmail(existingToken.email);

  if (!existingEmail) {
    return { error: true, message: "User does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { email: existingEmail.email },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });
  return { error: false, message: "Password updated successfully" };
};

export const ResetPasswordAction = async (
  values: z.infer<typeof ResetSchema>
) => {
  const validate = ResetSchema.safeParse(values);
  if (!validate.success) {
    return { error: true, message: "Invalid Email" };
  }
  const { email } = validate.data;
  const existingUser = await getCurentUserEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: true, message: "User does not exist" };
  }
  // send reset password email
  try {
    const newToke = await createResetPasswordToken(email);
    const emailData = await sendPasswordReseetEmail(
      newToke.email,
      newToke.token
    );
    return { error: false, message: "Reset password email sent" };
  } catch (error) {
    randarError(error);
  }

  return { error: false, message: "Reset password email sent" };
};

export const createResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  // save token to database with email and expiresAt
  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  const newToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
