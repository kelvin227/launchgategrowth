import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminCampaignsPage() {
    const session = await auth();
    if(!session) {
        redirect("/admin/login");
    }


  const rows = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true },
  });

  return (
    <div className="admin-campaigns">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Operations</span>
          <h1 className="admin-title">Campaign requests</h1>
        </div>
        <Link href="/campaign/request" className="button button-primary admin-new-button">
          New request
        </Link>
      </section>

      <section className="admin-panel admin-campaign-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Request inventory</span>
            <h2>All campaign requests</h2>
          </div>
          <span className="admin-count-badge">{rows.length} total</span>
        </div>

        <div className="admin-campaign-list">
          {rows.map((c) => (
            <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="admin-campaign-row">
              <div className="admin-campaign-row-main">
                <span className="admin-campaign-reference">{c.reference}</span>
                <span className="admin-campaign-company">{c.companyName}</span>
                <span className="admin-campaign-meta">
                  {c.service?.name ?? "Unassigned service"} · {c.industry ?? "Unspecified industry"}
                </span>
              </div>
              <div className="admin-campaign-row-side">
                <span className="admin-campaign-date">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
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
