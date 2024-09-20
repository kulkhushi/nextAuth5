"use server";

import { db } from "@/lib/db";

export const getCurentUserEmail = async (email: string) => {
  //Call your database here to get user by email
  //return your user object or null if not found
  const userEmail = await db.user.findUnique({
    where: { email },
  });
  if (!userEmail) {
    return null;
  }
  return userEmail;
};

export const getCurentUserByid = async (id: string) => {
  //Call your database here to get user by email
  //return your user object or null if not found

  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const veryVicationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verifyToken.findUnique({ 
      where: { token },
     });
     return verificationToken;
  } catch (error) {
    return null;
  }
}

export const verifyTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verifyToken.findFirst({ 
      where: { email },
     });
     return verificationToken;
  } catch (error) {
    return null;
  }
}