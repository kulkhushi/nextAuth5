'use server'

import { v4 as uuidv4 } from "uuid";
import { getCurentUserEmail, verifyTokenByEmail } from "./user-action";
import { db } from "@/lib/db";


export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000);

  // save token to database with email and expiresAt
  const existingToken = await verifyTokenByEmail(email);

  if (existingToken) {
    await db.verifyToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newToken = await db.verifyToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
  return newToken;
};


export const verifyAccountByToken=async (token:string)=>{
  const newVerifiedToken = await db.verifyToken.findUnique({
    where: { token }, 
  })
  if(!newVerifiedToken){
    return {
      message:"Token not found", error: true
    }
  }
  let expirationDate= newVerifiedToken.expiresAt ? new Date(newVerifiedToken.expiresAt) : undefined;
  const currentDate = new Date();
  try {
    expirationDate = new Date(newVerifiedToken.expiresAt);
    console.log('Parsed Expiration Date:', expirationDate);
  } catch (e) {
    console.error('Error parsing expiration date:', e);
  }

  if (expirationDate) {
    const hasExpired = expirationDate < currentDate;
    if(hasExpired){
      return {
        message:"Token has expired", error: true
      }
    }
  } else {
    console.error('Expiration date is undefined');
  }

  const existingEmail = await getCurentUserEmail(newVerifiedToken.email)

  if(!existingEmail){
    return {
      message:"User not found", error: true
    }
  } 
  await db.user.update({
    where: { id: existingEmail.id },
    data: { emailVerified: new Date(), email: newVerifiedToken.email  },
  });

  await db.verifyToken.delete({
    where: { id: newVerifiedToken.id },
  });

  return {
    message:"Your account has been verified successfully!", error: false
  }

}

