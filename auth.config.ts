import Credentials from "next-auth/providers/credentials";
import { hashPassword } from "./lib/utils";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";

const providers = [
    Credentials({
    name: "credentials",
    credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
    },
    authorize: async (credentials) => {
        
        if (!credentials?.email || !credentials?.password){
            return null
        };

        const password = credentials.password as string
        const email =  credentials.email as string

        // check for existing user
        let user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            return null
        } else {
            const isMatch = bcrypt.compareSync(password, user.password)
            if (!isMatch){
                return null
            }
        }

        return user
        
        
    }

})]

export const authConfig = {
    providers: providers,
} satisfies NextAuthConfig