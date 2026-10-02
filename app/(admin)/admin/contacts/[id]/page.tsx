import Link from "next/link";
import { notFound, redirect} from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { statusLabels } from "@/lib/data";
import { auth } from "@/auth";
import { UpdateStatusInline } from "@/components/admin/updateStatusComp";

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const request = await prisma.contact.findUnique({
    where: { id },
  });

  if (!request) {
    notFound();
  }


  const contact = request as any;
  const createdAt = contact.createdAt
    ? new Date(contact.createdAt).toLocaleString()
    : "Not available";

  return (
    <div className="admin-detail-page">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Company inquiry</span>
          <h1 className="admin-title">{contact.name || "Contact"}</h1>
        </div>

        <div className="admin-detail-actions">
          <Link href="/admin/contacts" className="button button-secondary">
            Back to list
          </Link>
          {/* Interactive Status Switcher Component */}
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
              <span className="admin-detail-label">Contact Name</span>
              <span className="admin-detail-value">
                {contact.name || "No name provided"}
              </span>
            </div>
            <StatusBadge status={contact.status} />
          </div>

          <div className="admin-detail-meta">
            <div className="detail-row">
              <span>Tracking ID: {" "}</span>
              <strong>{contact.trackingId || request.trackingId}</strong>
            </div>
            <div className="detail-row">
              <span>Submitted: {" "}</span>
              <strong>{createdAt}</strong>
            </div>
            <div className="detail-row">
              <span>Status:{" "}</span>
              <strong>{statusLabels[contact.status] || "Unknown"}</strong>
            </div>
          </div>
        </article>

        <article className="admin-detail-card">
          <div className="admin-detail-card-head compact">
            <h2>Contact information</h2>
          </div>

          <dl className="admin-detail-list">
            <div className="mb-3">
              <dt>Name: </dt>
              <dd>{contact.name || "Not provided"}</dd>
            </div>
            <div className="mb-3">
              <dt>Email: {" "}</dt>
              <dd>{contact.email || "Not provided"}</dd>
            </div>
            <div className="mb-3">
              <dt>Company:</dt>
              <dd>{contact.companyName || "Not provided"}</dd>
            </div>
          </dl>
        </article>

        <article className="admin-detail-card admin-detail-card-wide">
          <div className="admin-detail-card-head compact">
            <h2>Message</h2>
          </div>

          <p className="admin-detail-message">
            {contact.message || "No message was provided for this inquiry."}
          </p>
        </article>
      </section>
    </div>
  );
}
