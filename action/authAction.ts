"use server";
import z from "zod";
import { LoginScema, RegisterSchema } from "../schemas";
import { randarError, randarSuccess } from "./common";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getCurentUserEmail } from "./user-action";
import { signIn, signOut } from "@/auth";
import { Default_LOGIN_Redirect } from "@/routers";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateVerificationToken } from "./token";
import { sendTwoFactorTokenMail, sendVerificationEmail } from "@/lib/mail";
import {
  createTwoFactorAuthToken,
  getTwoFactorTokenByEmail,
  getTwoFactorConfiramationByUserID,
} from "./twoFactorAuthToken";
import { error } from "console";

export const LoginAction = async (values: z.infer<typeof LoginScema>) => {
  const validate = LoginScema.safeParse(values);
  if (!validate.success) {
    throw new Error("Invalid failed");
  }
  const { email, password,code } = validate.data;
  const existingUser = await getCurentUserEmail(validate.data.email);
  const isPasswordValid = await bcrypt.compare(password, existingUser?.password!);
  if (!isPasswordValid) {
    const error = new Error("Invalid Credentials");
    return randarError(error);
  }
  if (!existingUser || !existingUser.email) {
    const error = new Error("User does not exist");
    return randarError(error);
  }
 
 try {
    if (!existingUser.emailVerified) {
      const newToken = await generateVerificationToken(existingUser.email);
      const emailData = await sendVerificationEmail(
        newToken.email,
        newToken.token
      );
      return randarSuccess("Confirmation Email Sent");
    }

    if (existingUser.isTwoFactor && existingUser.email) {
      if(code){
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);

      if(!existingToken){
        return {message:"Invalid Two Factor Code", error:true };
      }

      if(existingToken.token !==code){
        return { message:"Invalid Two Factor Code",error:true };
      }

      const hasExpiredToken = new Date(existingToken.token) < new Date();

      if(hasExpiredToken){
        return { message:"Code is expired",error:true };
      }

      await db.twoFactorToken.delete({
        where: { id: existingToken.id },
      });

      const exConfirmation = await getTwoFactorConfiramationByUserID(existingToken.id);

      console.log("exConfirmation",exConfirmation);

      if(exConfirmation){
        await db.twofactorConfirmation.delete({
          where: { userId: existingUser.id },
        });
      }  

      await db.twofactorConfirmation.create({
        data: { userId: existingUser.id}
      });
       

      }else{
        const newToken = await createTwoFactorAuthToken(existingUser.email);
        const emailResponse = await sendTwoFactorTokenMail(
          existingUser.email,
          newToken.token
        );
        return { twoFactor: true };
      }
      
    }
  
    const user = await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    console.log("user", user);
  } catch (error) {
    if (isRedirectError(error)) {
      return redirect("/settings");
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Please check your Email or password",
            error: true,
          };
        case "AccessDenied":
          return {
            message: "Please Verify your account",
            error: true,
          };
        default:
          return {
            message: "Something went wrong",
            error: true,
          };
      }
    }
    return randarError(error);
  }
};

export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validate = RegisterSchema.safeParse(values);
  if (!validate.success) {
    throw new Error("Invalid failed");
  }

  try {
    const { email, password, name } = validate.data;
    const userExists = await getCurentUserEmail(email);
    if (userExists) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // save to database
    await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name,
      },
    });
    const newToken = await generateVerificationToken(email);
    const emailData = await sendVerificationEmail(
      newToken.email,
      newToken.token
    );
    console.log(emailData);
    return randarSuccess("Confirmation Email Sent");
  } catch (error) {
    return randarError(error);
  }
};

export async function doLogout() {
  await signOut({ redirectTo: "/auth/login" });
}
