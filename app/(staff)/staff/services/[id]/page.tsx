import { ServiceEditor } from "@/components/admin/service-editor";
import { getManagedService } from "@/lib/service-management";
import { notFound } from "next/navigation";

export default async function EditStaffServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getManagedService(id);
  if (!service) notFound();

  return <ServiceEditor basePath="/staff/services" service={{
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    category: service.category,
    icon: service.icon,
    helpsWith: service.helpsWith,
    tiers: service.tiers as Array<{ name: string; description: string }>,
    active: service.active,
    sortOrder: service.sortOrder,
  }} />;
}