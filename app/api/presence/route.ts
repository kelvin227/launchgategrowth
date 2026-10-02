import { auth } from "@/auth";
import { appendAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const RETURNED_ONLINE_AFTER_MS = 5 * 60 * 1000;

export async function POST() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  try {
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id: session.user.id },
        select: { lastSeenAt: true },
      });
      if (!user) return;

      const updated = await transaction.user.updateMany({
        where: { id: session.user.id, lastSeenAt: user.lastSeenAt },
        data: { lastSeenAt: now },
      });
      if (updated.count !== 1) return;

      if (user.lastSeenAt && now.getTime() - user.lastSeenAt.getTime() > RETURNED_ONLINE_AFTER_MS) {
        await appendAuditLog(transaction, {
          actor: { id: session.user.id, label: session.user.name || session.user.email || session.user.id },
          action: "BACK_ONLINE",
          entityType: "User",
          entityId: session.user.id,
          details: { lastSeenAt: user.lastSeenAt.toISOString() },
        });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("presence update failed", error);
    return NextResponse.json({ error: "Unable to update presence" }, { status: 503 });
  }
}