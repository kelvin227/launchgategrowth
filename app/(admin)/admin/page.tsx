import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if(!session) {
    redirect("/admin/login");
  }
  const [total, statusCounts, recent] = await Promise.all([
    prisma.campaign.count(),
    prisma.campaign.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { service: true },
    }),
  ]);

  const statusMap = new Map<string, number>();
  statusCounts.forEach((row) => statusMap.set(row.status, row._count._all));

  const stats = [
    { label: "Total", value: total },
    { label: "New", value: statusMap.get("NEW") ?? 0 },
    { label: "Contacted", value: statusMap.get("CONTACTED") ?? 0 },
    { label: "Planning", value: statusMap.get("PLANNING") ?? 0 },
    { label: "Live", value: statusMap.get("LIVE") ?? 0 },
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Dashboard</span>
          <h1 className="admin-title">Campaign requests</h1>
        </div>
        <div className="admin-date-chip">
          <span className="admin-date-chip-label">Latest intake</span>
          <span className="admin-date-chip-value">
            {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" })}
          </span>
        </div>
      </section>

      <section className="admin-stats-grid">
        {stats.map((s) => (
          <article className="admin-stat-card" key={s.label}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">{s.label}</span>
              <span className="admin-stat-icon">✦</span>
            </div>
            <div className="admin-stat-value">{s.value}</div>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Pipeline</span>
            <h2>Recent requests</h2>
          </div>
          <Link href="/admin/campaigns" className="admin-view-all">
            View all
          </Link>
        </div>

        <div className="admin-request-list">
          {recent.map((c) => (
            <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="admin-request-row">
              <div className="admin-request-left">
                <span className="admin-request-reference">{c.reference}</span>
                <span className="admin-request-company">
                  {c.companyName} <span className="admin-request-sep">·</span> {c.service?.name ?? "Unassigned service"}
                </span>
              </div>
              <div className="admin-request-right">
                <StatusBadge status={c.status} />
                <span className="admin-request-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}