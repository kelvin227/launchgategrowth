import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const PAGE_SIZE = 10;

type AdminActivityPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function formatDate(value: Date | null) {
  return value ? value.toLocaleString() : "Never";
}

function describeDetails(details: unknown) {
  if (!details || typeof details !== "object") return null;
  if ("recipient" in details && "subject" in details) {
    const emailDetails = details as { recipient: unknown; subject: unknown };
    return [
      `To: ${String(emailDetails.recipient)}`,
      `Subject: ${String(emailDetails.subject)}`,
    ].map((item) => <span key={item} className="activity-change">{item}</span>);
  }
  if (!("changes" in details)) {
    if (!("snapshot" in details)) return null;
    const snapshot = (details as { snapshot?: Record<string, unknown> }).snapshot;
    if (!snapshot) return null;
    const summary = ["name", "reference", "trackingId", "companyName", "email", "status", "slug"]
      .filter((key) => snapshot[key] !== undefined)
      .map((key) => `${key}: ${String(snapshot[key])}`);
    return summary.map((item) => <span key={item} className="activity-change">{item}</span>);
  }
  const changes = (details as { changes?: Record<string, { from: unknown; to: unknown }> }).changes;
  if (!changes) return null;
  return Object.entries(changes).map(([field, change]) => (
    <span key={field} className="activity-change">
      {field}: {String(change.from ?? "empty")} → {String(change.to ?? "empty")}
    </span>
  ));
}

export default async function AdminActivityPage({ searchParams }: AdminActivityPageProps) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const parsedPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const requestedPage = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [totalActivity, users] = await Promise.all([
    prisma.auditLog.count(),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "STAFF"] } },
      orderBy: [{ lastSeenAt: "desc" }, { name: "asc" }],
      select: { id: true, name: true, email: true, role: true, lastLoginAt: true, lastSeenAt: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalActivity / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const activity = await prisma.auditLog.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  const onlineCutoff = Date.now() - 2 * 60 * 1000;

  return (
    <div className="admin-activity">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Security and operations</span>
          <h1 className="admin-title">Activity log</h1>
        </div>
        <span className="admin-count-badge">{totalActivity} entries</span>
      </section>

      <section className="admin-panel activity-presence-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Team presence</span>
            <h2>Login and online status</h2>
          </div>
          <span className="admin-count-badge">{users.filter((user) => user.lastSeenAt && user.lastSeenAt.getTime() >= onlineCutoff).length} online</span>
        </div>
        <div className="activity-user-list">
          {users.map((user) => {
            const online = Boolean(user.lastSeenAt && user.lastSeenAt.getTime() >= onlineCutoff);
            return (
              <div className="activity-user-row" key={user.id}>
                <span className={`activity-presence-dot ${online ? "online" : ""}`} aria-label={online ? "Online" : "Offline"} />
                <span className="activity-user-name">{user.name || user.email}</span>
                <span className="activity-user-role">{user.role}</span>
                <span className="activity-user-meta">Last login {formatDate(user.lastLoginAt)}</span>
                <span className="activity-user-meta">Last online {formatDate(user.lastSeenAt)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="admin-panel activity-log-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Recorded changes</span>
            <h2>Recent database activity</h2>
          </div>
        </div>
        <div className="activity-log-list">
          {activity.map((entry) => (
            <article className="activity-log-row" key={entry.id}>
              <div className="activity-log-main">
                <strong>{entry.actorLabel}</strong>
                <span>{entry.action.replaceAll("_", " ")} {entry.entityType}{entry.entityId ? ` · ${entry.entityId}` : ""}</span>
                {describeDetails(entry.details)}
              </div>
              <time dateTime={entry.createdAt.toISOString()}>{formatDate(entry.createdAt)}</time>
            </article>
          ))}
          {activity.length === 0 && <p className="activity-empty">No activity recorded yet.</p>}
        </div>
        {totalActivity > 0 && (
          <nav className="activity-pagination" aria-label="Activity log pages">
            <span className="activity-pagination-summary">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, totalActivity)} of {totalActivity}
            </span>
            <div className="activity-pagination-controls">
              {page > 1 ? (
                <Link className="activity-pagination-link" href={`?page=${page - 1}`} rel="prev">Previous</Link>
              ) : (
                <span className="activity-pagination-link disabled" aria-disabled="true">Previous</span>
              )}
              <span className="activity-pagination-current">Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link className="activity-pagination-link" href={`?page=${page + 1}`} rel="next">Next</Link>
              ) : (
                <span className="activity-pagination-link disabled" aria-disabled="true">Next</span>
              )}
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}