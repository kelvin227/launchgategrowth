import Link from "next/link";
import { listManagedServices } from "@/lib/service-management";

export async function ServiceCatalog({ basePath }: { basePath: string }) {
  const services = await listManagedServices();

  return (
    <div className="admin-services">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Operations</span>
          <h1 className="admin-title">Services</h1>
        </div>
        <div className="admin-service-page-actions">
          <Link href="/services" className="button button-secondary">Public view</Link>
          <Link href={`${basePath}/new`} className="button button-primary admin-new-button">Add service</Link>
        </div>
      </section>

      <section className="admin-panel admin-service-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Service catalog</span>
            <h2>Launch services</h2>
          </div>
          <span className="admin-count-badge">{services.length} total</span>
        </div>

        {services.length === 0 ? (
          <p className="admin-service-empty">No services yet. Add the first service to publish it to the catalog.</p>
        ) : (
          <div className="admin-service-grid">
            {services.map((service) => (
              <article className="admin-service-card" key={service.id}>
                <div className="admin-service-card-top">
                  <span className="admin-service-category">{service.category}</span>
                  <span className={`admin-service-status ${service.active ? "is-live" : "is-archived"}`}>
                    {service.active ? "Live" : "Archived"}
                  </span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="admin-service-meta">
                  <span>{service.tiers.length} offer tiers</span>
                  <span>{service.helpsWith.length} capabilities</span>
                </div>
                <Link href={`${basePath}/${service.id}`} className="admin-service-edit">Edit service <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}