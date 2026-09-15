import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminServicesPage() {
    const session = await auth();
    if(!session) {
      redirect("/admin/login");
    }
    
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="admin-services">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Operations</span>
          <h1 className="admin-title">Services</h1>
        </div>
        <Link href="/services" className="button button-primary admin-new-button">
          Public view
        </Link>
      </section>

      <section className="admin-panel admin-service-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Service catalog</span>
            <h2>Active launch services</h2>
          </div>
          <span className="admin-count-badge">{services.length} total</span>
        </div>

        <div className="admin-service-grid">
          {services.map((service) => (
            <article className="admin-service-card" key={service.id}>
              <div className="admin-service-card-top">
                <span className="admin-service-category">{service.category}</span>
                <span className="admin-service-status">Live</span>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="admin-service-meta">
                <span>{(service.tiers as Array<{ name: string; description: string }> ?? []).length} offer tiers</span>
                <span>{(service.helpsWith ?? []).length} capabilities</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
