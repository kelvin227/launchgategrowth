"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function Login(email: string, password: string, panel: string) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        })
        if(!existingUser){
            return {success: false, message: "User does not exist"}
        }
        const isMatch = bcrypt.compareSync(password, existingUser.password)
        if(!isMatch){
            return {success: false, message: "Incorrect password"}
        }
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (existingUser.role === "ADMIN" || existingUser.role === "STAFF") {
            return { success: true, message: "", redirect: "/admin" };
        }

        if (existingUser.role === "ADVERTISER") {
            return { success: true, message: "", redirect: "/" };
        }

        return { success: false, message: "This account cannot access the workspace." };
    } catch (error) {
        console.error(error)
        return {success: false, message: "There's an error somewhere"}
    }
}

export async function logout(){
    await signOut(
        {redirectTo: "/"}
    )
}