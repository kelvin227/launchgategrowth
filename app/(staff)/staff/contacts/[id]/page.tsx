import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge2 } from "@/components/status-badge";
import { statusLabels } from "@/lib/data";
import { auth } from "@/auth";
import { UpdateStatusInline } from "@/components/admin/updateStatusComp";

export default async function StaffContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
    const session = await auth();
    if(!session?.user) {
      redirect("/admin/login");
    }
  const request = await prisma.contact.findUnique({
    where: { id },
  });

  if (!request) {
    notFound();
  }


  const createdAt = request.createdAt.toLocaleString();

  return (
    <div className="admin-detail-page">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Contact request</span>
          <h1 className="admin-title">{request.name}</h1>
        </div>

        <div className="admin-detail-actions">
          <Link href="/staff/contacts" className="button button-secondary">
            Back to list
          </Link>
          <UpdateStatusInline
            campaignPage={false}
            campaignId={request.id}
            currentStatus={request.status}
            statusLabels={statusLabels}
          />
        </div>
      </section>

      <section className="admin-detail-grid">
        <article className="admin-detail-card admin-detail-card-primary">
          <div className="admin-detail-card-head">
            <div>
              <span className="admin-detail-label">Contact name</span>
              <h2>{request.name}</h2>
            </div>
            <StatusBadge2 status={request.status} />
          </div>

          <div className="admin-detail-fields">
            <div>
              <span className="admin-detail-label">Email</span>
              <span className="admin-detail-value">{request.email}</span>
            </div>
            <div>
              <span className="admin-detail-label">Company</span>
              <span className="admin-detail-value">{request.companyName ?? "—"}</span>
            </div>
            <div>
              <span className="admin-detail-label">Tracking ID</span>
              <span className="admin-detail-value">{request.trackingId}</span>
            </div>
            <div>
              <span className="admin-detail-label">Submitted</span>
              <span className="admin-detail-value">{createdAt}</span>
            </div>
          </div>

          <div className="admin-detail-goal">
            <span className="admin-detail-label">Message</span>
            <p>{request.message || "No message was provided."}</p>
          </div>
        </article>

        <aside className="admin-detail-card">
          <div className="admin-detail-card-head compact">
            <div>
              <span className="admin-panel-kicker">Timeline</span>
              <h2>Status</h2>
            </div>
          </div>
          <div className="admin-timeline">
            <div className="admin-timeline-row">
              <span className="admin-timeline-dot" />
              <span className="admin-timeline-copy">{statusLabels[request.status] ?? request.status}</span>
            </div>
            <div className="admin-timeline-row">
              <span className="admin-timeline-dot" />
              <span className="admin-timeline-copy">Submitted {request.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
