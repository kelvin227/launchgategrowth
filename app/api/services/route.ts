import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

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
