import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs' 
import { LoginScema } from "../schemas"
import { getCurentUserEmail } from "../action/user-action";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
 
export default { providers: [
    Github({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }),

    Credentials({
       async authorize(credentials, request) {
            const validateData = LoginScema.safeParse(credentials);

            if(validateData.success){
                const {email,password} = validateData.data;
                const user = await getCurentUserEmail(email);
                if(!user || !user.password!) return null;
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if(isPasswordValid) return user;
            }
            return null;
        },
    }),
] } satisfies NextAuthConfig