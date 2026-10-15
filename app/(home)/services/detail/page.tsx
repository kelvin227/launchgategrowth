import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true },
  });

  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug, active: true },
  });

  if (!service) notFound();

  const tiers = (service.tiers as Array<{ name: string; description: string }> | null) ?? [];

  return (
    <div className="public-page service-detail-page">
      <section className="public-hero">
        <div className="container-content">
          <Link href="/services" className="public-back-link">
            <span aria-hidden="true">←</span> All services
          </Link>
          <div className="public-hero-copy">
            <p className="public-kicker">{service.category}</p>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            <Link
              href={`/campaign/request?service=${service.slug}`}
              className="button button-primary"
            >
              Start a campaign
            </Link>
          </div>
        </div>
      </section>

      <section className="container-content public-content service-detail-grid">
        <article className="detail-panel">
          <div className="public-section-heading">
            <span className="public-index">01</span>
            <h2>What we can help with</h2>
          </div>
          <ul className="detail-list">
            {(service.helpsWith ?? []).map((item) => (
              <li key={item}>
                <span className="detail-list-mark" aria-hidden="true">↗</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="detail-panel">
          <div className="public-section-heading">
            <span className="public-index">02</span>
            <h2>Campaign types</h2>
          </div>
          <p className="detail-intro">
            The team determines the final campaign structure and price after
            reviewing your request.
          </p>
          <div className="tier-list">
            {tiers.map((tier) => (
              <div key={tier.name} className="tier-card">
                <h3>{tier.name}</h3>
                <p>{tier.description}</p>
              </div>
            ))}
          </div>
          <Link
            href={`/campaign/request?service=${service.slug}`}
            className="text-link"
          >
            Request this campaign <span aria-hidden="true">→</span>
          </Link>
        </article>
      </section>
    </div>
  );
}
