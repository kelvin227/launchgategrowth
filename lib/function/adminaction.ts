"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CampaignStatus, ContactStatus } from "@prisma/client";
import { auth } from "@/auth";
import { appendAuditLog, auditChanges } from "@/lib/audit";

export async function updateCampaignStatus(campaignId: string, newStatus: CampaignStatus) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
      return { success: false, error: "You are not authorized to update campaigns" };
    }

    await prisma.$transaction(async (transaction) => {
      const before = await transaction.campaign.findUniqueOrThrow({ where: { id: campaignId } });
      const campaign = await transaction.campaign.update({
        where: { id: campaignId },
        data: { status: newStatus },
      });
      await appendAuditLog(transaction, {
        actor: { id: session.user.id, label: session.user.name || session.user.email || session.user.id },
        action: "UPDATE",
        entityType: "Campaign",
        entityId: campaign.id,
        details: { changes: auditChanges({ status: before.status }, { status: campaign.status }) },
      });
    });

    revalidatePath(`/admin/campaigns/${campaignId}`);
    revalidatePath(`/staff/campaigns/${campaignId}`);
    revalidatePath("/staff/campaigns");
    return { success: true };
  } catch (error) {
    console.error("Failed to update campaign status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateContactStatus(id: string, newStatus: ContactStatus) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
      return { success: false, error: "You are not authorized to update contacts" };
    }

    await prisma.$transaction(async (transaction) => {
      const before = await transaction.contact.findUniqueOrThrow({ where: { id } });
      const contact = await transaction.contact.update({
        where: { id },
        data: { status: newStatus },
      });
      await appendAuditLog(transaction, {
        actor: { id: session.user.id, label: session.user.name || session.user.email || session.user.id },
        action: "UPDATE",
        entityType: "Contact",
        entityId: contact.id,
        details: { changes: auditChanges({ status: before.status }, { status: contact.status }) },
      });
    });

    revalidatePath(`/admin/contacts/${id}`);
    revalidatePath(`/staff/contacts/${id}`);
    revalidatePath("/staff/contacts");
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact status:", error);
    return { success: false, error: "Failed to update status" };
  }
}