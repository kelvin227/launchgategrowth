"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignStatus, updateContactStatus } from "@/lib/function/adminaction"; 
import { CampaignStatus } from "@prisma/client";

interface UpdateStatusProps {
  campaignPage: boolean;
  campaignId: string;
  currentStatus: any;
  statusLabels: Record<string, string>;
}

export function UpdateStatusInline({ campaignPage, campaignId, currentStatus, statusLabels }: UpdateStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  // Get all entries as [key, label] pairs
  const allEntries = Object.entries(statusLabels);

  // Filter specific statuses if it's not the campaign page
  const filteredEntries = allEntries.filter(([key]) => 
    ["PENDING", "ARCHIVED", "CONTACTED"].includes(key)
  );

  // Choose which list of options to display based on campaignPage prop
  const optionsToDisplay = campaignPage ? allEntries : filteredEntries;

  const handleSave = () => {
    startTransition(async () => {
      // Fixed: pass `status` (the new value) instead of `currentStatus`
      const res = campaignPage 
        ? await updateCampaignStatus(campaignId, status) 
        : await updateContactStatus(campaignId, status);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="button button-primary"
        >
          Update status
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CampaignStatus)}
            disabled={isPending}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500"
          >
            {optionsToDisplay.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={isPending || status === currentStatus}
            className="button button-primary disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setStatus(currentStatus);
              setIsOpen(false);
            }}
            disabled={isPending}
            className="button button-secondary text-xs"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}