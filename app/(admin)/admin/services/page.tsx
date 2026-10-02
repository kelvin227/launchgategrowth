import { ServiceCatalog } from "@/components/admin/service-catalog";

export default async function AdminServicesPage() {
  return <ServiceCatalog basePath="/admin/services" />;
}
