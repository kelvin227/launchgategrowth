import { Prisma } from "@prisma/client";

type AuditActor = {
  id?: string | null;
  label: string;
};

type AuditEntry = {
  actor?: AuditActor;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: unknown;
};

export async function appendAuditLog(
  transaction: Prisma.TransactionClient,
  entry: AuditEntry,
) {
  await transaction.auditLog.create({
    data: {
      actorId: entry.actor?.id ?? null,
      actorLabel: entry.actor?.label ?? "System",
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      details: entry.details === undefined
        ? undefined
        : JSON.parse(JSON.stringify(entry.details)) as Prisma.InputJsonValue,
    },
  });
}

export function auditChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
) {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  for (const key of keys) {
    const from = normalizeAuditValue(before[key]);
    const to = normalizeAuditValue(after[key]);
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes[key] = { from: from ?? null, to: to ?? null };
    }
  }

  return changes;
}

export function auditSnapshot(value: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function normalizeAuditValue(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return value;
}