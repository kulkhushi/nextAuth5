import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getCurentUserByid, getCurentUserEmail } from "../action/user-action";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfiramationByUserID } from "../action/twoFactorAuthToken";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  events:{
    async linkAccount({user}) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {    
    async signIn({ user, account }) {
      if(account?.provider !== 'credentials') return true;
      const existinguser = await getCurentUserEmail(user.email as string);  
      if (!existinguser || !existinguser.emailVerified) {
        return false;
      }
      if(existinguser.isTwoFactor){
       const toFactorConfirm = await getTwoFactorConfiramationByUserID(existinguser.id);
       if(!toFactorConfirm) return false

       await db.twofactorConfirmation.delete({
         where: { userId: existinguser.id },
       })
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await getCurentUserByid(token.sub);
      if (!user) return token;
      token.role = user.role;
      console.log(token);
      return token;
    },
  },
});
