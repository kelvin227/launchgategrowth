import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkServiceMutationLimit, parseServiceInput, withDatabaseRetry } from "@/lib/service-management";
import { appendAuditLog, auditSnapshot } from "@/lib/audit";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateLookup = new Map<string, { count: number; windowStartedAt: number }>();

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "local";
  return ip || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLookup.get(key);

  if (!entry || now - entry.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    rateLookup.set(key, { count: 1, windowStartedAt: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function GET(request: Request) {
  const key = getClientKey(request);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many service requests. Try again shortly." },
      { status: 429 }
    );
  }

  try {
    const services = await withDatabaseRetry(() => prisma.service.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }));

    const payload = services.map((service: any) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      category: service.category,
      shortDescription: service.description,
      helpsWith: Array.isArray(service.helpsWith) ? service.helpsWith : [],
      tiers: Array.isArray(service.tiers) ? service.tiers : [],
      active: service.active,
      icon: service.icon,
    }));

    return NextResponse.json({ services: payload }, { status: 200 });
  } catch (error) {
    console.error("services route failed", error);
    return NextResponse.json({ error: "Unable to load services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid service data." }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const input = parseServiceInput(payload.service);
  const idempotencyKey = typeof payload.idempotencyKey === "string" ? payload.idempotencyKey : "";
  if (!input || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return NextResponse.json({ error: "Check the service details and try again." }, { status: 400 });
  }

  try {
    const result = await withDatabaseRetry(async () => {
      return prisma.$transaction(async (transaction) => {
        const existing = await transaction.service.findUnique({ where: { id: idempotencyKey } });
        if (existing) return { service: existing, created: false };
        const service = await transaction.service.create({ data: { ...input, id: idempotencyKey } });
        await appendAuditLog(transaction, {
          actor: { id: session.user.id, label: session.user.name || session.user.email || session.user.id },
          action: "CREATE",
          entityType: "Service",
          entityId: service.id,
          details: { snapshot: auditSnapshot(service) },
        });
        return { service, created: true };
      });
    });
    if (result.service.slug !== input.slug) {
      return NextResponse.json({ error: "This create request has already been used." }, { status: 409 });
    }
    return NextResponse.json({ service: result.service }, { status: result.created ? 201 : 200 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      const existing = await withDatabaseRetry(() => prisma.service.findUnique({ where: { id: idempotencyKey } })).catch(() => null);
      if (existing?.slug === input.slug) return NextResponse.json({ service: existing }, { status: 200 });
      return NextResponse.json({ error: "That URL slug is already in use." }, { status: 409 });
    }
    console.error("service create failed", error);
    return NextResponse.json({ error: "Unable to create this service right now." }, { status: 503 });
  }
}
