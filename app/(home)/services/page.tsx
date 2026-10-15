import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ServiceCategory } from "@/lib/type";

const categoryOrder: ServiceCategory[] = ["Social & Content", "Web3 & Digital", "Real-World"];

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="public-page services-page">
      <section className="public-hero">
        <div className="container-content">
          <div className="public-hero-copy">
            <p className="public-kicker">Campaign capability</p>
            <h1>Every campaign starts with a goal, not a package.</h1>
            <p>
              Choose the platform or setting you want to reach people in. The
              exact campaign structure — audience, timing, and budget — is
              scoped with our team after you submit a request.
            </p>
          </div>
        </div>
      </section>

      <div className="container-content public-content">
        <div className="service-category-list">
          {categoryOrder.map((category, index) => {
            const items = services.filter((s) => s.category === category && s.active);
            return (
              <section key={category} className="service-category">
                <div className="public-section-heading">
                  <span className="public-index">{String(index + 1).padStart(2, "0")}</span>
                  <h2>{category}</h2>
                  <span className="public-heading-rule" aria-hidden="true" />
                </div>
                <div className="service-card-grid">
                  {items.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="service-card"
                    >
                      <span className="service-card-category">{category}</span>
                      <span className="service-card-title">{service.name}</span>
                      <span className="service-card-description">{service.description}</span>
                      <span className="service-card-link">View service <span aria-hidden="true">↗</span></span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="public-cta-band">
          <div>
            <p className="public-kicker">A campaign built around your brief</p>
            <h2>Have something different in mind?</h2>
            <p>Start a custom campaign and describe your goal directly.</p>
          </div>
          <Link href="/campaign/request" className="button button-primary">
            Start a custom campaign
          </Link>
        </section>
      </div>
    </div>
  );
}