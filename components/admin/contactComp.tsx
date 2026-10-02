import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge2 } from "@/components/status-badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminCampaignsPage({
  basePath = "/admin/contacts",
}: {
  basePath?: string;
}) {
    const session = await auth();
    if(!session) {
        redirect("/admin/login");
    }


  const rows = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="admin-campaigns">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Operations</span>
          <h1 className="admin-title">Contact requests</h1>
        </div>
        <Link href="/contact" className="button button-primary admin-new-button">
          New contact
        </Link>
      </section>

      <section className="admin-panel admin-campaign-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Request inventory</span>
            <h2>All client contact requests</h2>
          </div>
          <span className="admin-count-badge">{rows.length} total</span>
        </div>

        <div className="admin-campaign-list">
          {rows.map((c: any) => (
            <Link key={c.id} href={`${basePath}/${c.id}`} className="admin-campaign-row">
              <div className="admin-campaign-row-main">
                <span className="admin-campaign-reference">{c.trackingId}</span>
                <span className="admin-campaign-company">{c.name}</span>
              </div>
              <div className="admin-campaign-row-side">
                <span className="admin-campaign-date">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <StatusBadge2 status={c.status} />
                <span className="admin-request-arrow">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
