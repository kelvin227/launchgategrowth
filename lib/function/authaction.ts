"use server"

import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { appendAuditLog } from "@/lib/audit"

const RETURNED_ONLINE_AFTER_MS = 5 * 60 * 1000;

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

        const now = new Date();
        await prisma.$transaction(async (transaction) => {
            const user = await transaction.user.findUniqueOrThrow({
                where: { id: existingUser.id },
                select: { lastSeenAt: true },
            });
            await transaction.user.update({
                where: { id: existingUser.id },
                data: { lastLoginAt: now, lastSeenAt: now },
            });
            const actor = {
                id: existingUser.id,
                label: existingUser.name || existingUser.email,
            };
            await appendAuditLog(transaction, {
                actor,
                action: "LOGIN",
                entityType: "User",
                entityId: existingUser.id,
            });
            if (user.lastSeenAt && now.getTime() - user.lastSeenAt.getTime() > RETURNED_ONLINE_AFTER_MS) {
                await appendAuditLog(transaction, {
                    actor,
                    action: "BACK_ONLINE",
                    entityType: "User",
                    entityId: existingUser.id,
                    details: { lastSeenAt: user.lastSeenAt.toISOString() },
                });
            }
        });

        if (existingUser.role === "ADMIN") {
            return { success: true, message: "", redirect: "/admin" };
        }
        if(existingUser.role === "STAFF")  {
            return { success: true, message: "", redirect: "/staff" };
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
    const { auth } = await import("@/auth");
    const session = await auth();
    if (session?.user) {
        await prisma.auditLog.create({
            data: {
                actorId: session.user.id,
                actorLabel: session.user.name || session.user.email || session.user.id,
                action: "LOGOUT",
                entityType: "User",
                entityId: session.user.id,
            },
        });
    }
    await signOut(
        {redirectTo: "/"}
    )
}