import { auth } from "@/auth";
import { checkServiceMutationLimit, parseServiceInput, withDatabaseRetry } from "@/lib/service-management";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { appendAuditLog, auditChanges } from "@/lib/audit";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "You are not authorized to manage services." }, { status: 403 });
  }

  let limit;
  try {
    limit = await checkServiceMutationLimit(session.user.id);
  } catch (error) {
    console.error("service rate limit check failed", error);
    return NextResponse.json({ error: "Unable to verify service limits right now." }, { status: 503 });
  }
  if (limit.limited) {
    return NextResponse.json(
      { error: "Too many service changes. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let input;
  try {
    input = parseServiceInput(await request.json());
  } catch {
    input = null;
  }
  if (!input) return NextResponse.json({ error: "Check the service details and try again." }, { status: 400 });

  const { id } = await params;
  try {
    const service = await withDatabaseRetry(() => prisma.$transaction(async (transaction) => {
      const before = await transaction.service.findUniqueOrThrow({ where: { id } });
      const updated = await transaction.service.update({ where: { id }, data: input });
      await appendAuditLog(transaction, {
        actor: { id: session.user.id, label: session.user.name || session.user.email || session.user.id },
        action: "UPDATE",
        entityType: "Service",
        entityId: updated.id,
        details: { changes: auditChanges(before, updated) },
      });
      return updated;
    }));
    return NextResponse.json({ service });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "That URL slug is already in use." }, { status: 409 });
    }
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "This service no longer exists." }, { status: 404 });
    }
    console.error("service update failed", error);
    return NextResponse.json({ error: "Unable to save this service right now." }, { status: 503 });
  }
}