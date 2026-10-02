"use client"
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { statusLabels } from "@/lib/data";
import { UpdateStatusInline } from "@/components/admin/updateStatusComp"; // Import your client component
import { useState } from "react";

const contactMethodLabels: Record<string, string> = {
  EMAIL: "Email",
  TELEGRAM: "Telegram",
  WHATSAPP: "WhatsApp",
  PHONE: "Phone",
};

export default function AdminCampaignDetailComp({
  request,
  basePath = "/admin/campaigns",
}: {
  request: any;
  basePath?: string;
}) {
  return (
    <div className="admin-detail-page">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Campaign request</span>
          <h1 className="admin-title">{request.reference}</h1>
        </div>

        <div className="admin-detail-actions flex items-center gap-3">
          <Link href={basePath} className="button button-secondary">
            Back to list
          </Link>
          
          {/* Interactive Status Switcher Component */}
          <UpdateStatusInline 
            campaignPage={true}
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
              <span className="admin-panel-kicker">Company</span>
              <h2>{request.companyName}</h2>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="admin-detail-fields">
            <div>
              <span className="admin-detail-label">Contact</span>
              <span className="admin-detail-value">{request.contactPersonName}</span>
            </div>
            <div>
              <span className="admin-detail-label">Email</span>
              <span className="admin-detail-value">{request.businessEmail}</span>
            </div>
            <div>
              <span className="admin-detail-label">Service</span>
              <span className="admin-detail-value">{request.service?.name ?? "Unassigned"}</span>
            </div>
            <div>
              <span className="admin-detail-label">Platform</span>
              <span className="admin-detail-value">{request.targetPlatforms.join(", ") || "—"}</span>
            </div>
            <div>
              <span className="admin-detail-label">Budget</span>
              <span className="admin-detail-value">{request.estimatedBudget ?? "—"}</span>
            </div>
            <div>
              <span className="admin-detail-label">Country</span>
              <span className="admin-detail-value">{request.targetCountry ?? "—"}</span>
            </div>
            <div>
              <span className="admin-detail-label">Preferred contact</span>
              <span className="admin-detail-value">{contactMethodLabels[request.preferredContactMethod] ?? request.preferredContactMethod}</span>
            </div>
            <div>
              <span className="admin-detail-label">Website</span>
              <span className="admin-detail-value">{request.website ?? "—"}</span>
            </div>
          </div>

          <div className="admin-detail-goal">
            <span className="admin-detail-label">Campaign goal</span>
            <p>{request.campaignGoal}</p>
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
              <span className="admin-timeline-copy">{statusLabels[request.status]}</span>
            </div>
            <div className="admin-timeline-row">
              <span className="admin-timeline-dot" />
              <span className="admin-timeline-copy">Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="admin-timeline-row">
              <span className="admin-timeline-dot" />
              <span className="admin-timeline-copy">Follow-up due in 24h</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}