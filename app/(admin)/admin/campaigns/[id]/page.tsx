import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import AdminCampaignDetailComp from "@/components/admin/campaigndetailspage";

export default async function AdminDetailsCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}){  
  const { id } = await params;

  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const request = await prisma.campaign.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!request) {
    notFound();
  }
  
  return(
    <AdminCampaignDetailComp request={request} />
  )
}