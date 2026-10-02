import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ServiceTier = {
  name: string;
  description: string;
};

export type ServiceInput = {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  helpsWith: string[];
  tiers: ServiceTier[];
  active: boolean;
  sortOrder: number;
};

const mutationLimit = 30;

export async function checkMutationRateLimit(key: string, maxRequests: number, windowMs: number) {
  const windowSeconds = Math.ceil(windowMs / 1000);
  const [entry] = await withDatabaseRetry(() => prisma.$queryRaw<Array<{ count: number; window_started_at: Date }>>(Prisma.sql`
    INSERT INTO "service_mutation_rate_limits" ("key", "count", "window_started_at")
    VALUES (${key}, 1, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "service_mutation_rate_limits"."window_started_at" <= CURRENT_TIMESTAMP - make_interval(secs => ${windowSeconds}) THEN 1
        ELSE LEAST("service_mutation_rate_limits"."count" + 1, ${maxRequests + 1})
      END,
      "window_started_at" = CASE
        WHEN "service_mutation_rate_limits"."window_started_at" <= CURRENT_TIMESTAMP - make_interval(secs => ${windowSeconds}) THEN CURRENT_TIMESTAMP
        ELSE "service_mutation_rate_limits"."window_started_at"
      END
    RETURNING "count", "window_started_at"
  `));

  const retryAfter = Math.max(1, Math.ceil((entry.window_started_at.getTime() + windowMs - Date.now()) / 1000));
  return { limited: entry.count > maxRequests, retryAfter: entry.count > maxRequests ? retryAfter : 0 };
}

export function checkServiceMutationLimit(key: string) {
  return checkMutationRateLimit(key, 30, 60_000);
}

export function parseServiceInput(value: unknown): ServiceInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const category = typeof input.category === "string" ? input.category.trim() : "";
  const icon = typeof input.icon === "string" ? input.icon.trim() : "";
  const sortOrder = Number(input.sortOrder);

  if (
    !name || name.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100 ||
    !description || description.length > 3000 ||
    !category || category.length > 80 ||
    !icon || icon.length > 80 ||
    !Array.isArray(input.helpsWith) || input.helpsWith.length > 30 ||
    !Array.isArray(input.tiers) || input.tiers.length > 20 ||
    !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 100_000 ||
    typeof input.active !== "boolean"
  ) {
    return null;
  }

  const helpsWith = input.helpsWith.map((item) => typeof item === "string" ? item.trim() : "");
  if (helpsWith.some((item) => !item || item.length > 160)) return null;

  const tiers: ServiceTier[] = [];
  for (const value of input.tiers) {
    if (!value || typeof value !== "object") return null;
    const tier = value as Record<string, unknown>;
    const tierName = typeof tier.name === "string" ? tier.name.trim() : "";
    const tierDescription = typeof tier.description === "string" ? tier.description.trim() : "";
    if (!tierName || tierName.length > 100 || !tierDescription || tierDescription.length > 500) return null;
    tiers.push({ name: tierName, description: tierDescription });
  }

  return { name, slug, description, category, icon, helpsWith, tiers, active: input.active, sortOrder };
}

function isRetryableDatabaseError(error: unknown) {
  const code = (error as { code?: string })?.code;
  return ["P1001", "P1002", "P1008", "P1017", "P2024", "P2034"].includes(code ?? "");
}

export async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableDatabaseError(error) || attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 150 * 2 ** attempt));
    }
  }

  throw new Error("Service database operation did not complete");
}

export async function listManagedServices() {
  return withDatabaseRetry(() => prisma.service.findMany({
    orderBy: [{ active: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  }));
}

export async function getManagedService(id: string) {
  return withDatabaseRetry(() => prisma.service.findUnique({ where: { id } }));
}