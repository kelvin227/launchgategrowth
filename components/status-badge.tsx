import { CampaignStatus, ContactStatus } from "@/lib/type";
import { statusLabels } from "@/lib/data";

const styles: Record<CampaignStatus, string> = {
  NEW: "bg-signal/15 text-signal-bright border-signal/30",
  CONTACTED: "bg-ink-600/40 text-ink-100 border-line",
  PLANNING: "bg-ink-600/40 text-ink-100 border-line",
  OFFER_SENT: "bg-amber/15 text-amber border-amber/30",
  APPROVED: "bg-amber/15 text-amber border-amber/30",
  PAYMENT_PENDING: "bg-amber/15 text-amber border-amber/30",
  PAID: "bg-moss/15 text-moss border-moss/30",
  CAMPAIGN_PREPARATION: "bg-moss/15 text-moss border-moss/30",
  LIVE: "bg-moss/20 text-moss border-moss/40",
  COMPLETED: "bg-ink-600/40 text-ink-300 border-line",
  CANCELLED: "bg-rose/15 text-rose border-rose/30",
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

const styles2: Record<ContactStatus, string> = {
  // NEW: "bg-signal/15 text-signal-bright border-signal/30",
  CONTACTED: "bg-ink-600/40 text-ink-100 border-line",
  PENDING: "bg-amber/15 text-amber border-amber/30",
  ARCHIVED: "bg-ink-600/40 text-ink-300 border-line",
};

export function StatusBadge2({ status }: { status: ContactStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-medium ${styles2[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}