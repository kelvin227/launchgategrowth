import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categories = [
  {
    name: "Social & Content",
    description: "Campaigns across the platforms where your audience already spends time.",
  },
  {
    name: "Web3 & Digital",
    description: "Participation campaigns for launches, mints, and product milestones.",
  },
  {
    name: "Real-World",
    description: "Campaigns that move people — into rooms, stores, and events.",
  },
] as const;

const steps = [
  "You submit a campaign request",
  "Our team reviews and contacts you",
  "We structure a custom offer",
  "Campaign goes live once agreed",
];

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-glow" aria-hidden />
        <div className="container-content hero-grid">
          <div className="hero-copy">
            <div className="section-tag">Managed campaigns, not follower counts</div>
            <h1 className="hero-title">
              You set the goal.
              <br />
              We build the campaign.
              <br />
              <span className="hero-title-gold">Real people</span> create the impact.
            </h1>
            <p className="hero-lede">
              LaunchGate is a campaign-request platform. Tell us what you&apos;re
              trying to achieve, and our Growth Team reviews, structures, and
              runs a campaign around it — with real participation, not
              inflated numbers.
            </p>

            <div className="hero-actions">
              <Link href="/campaign/request" className="button button-primary">
                Start a campaign
              </Link>
              <Link href="/services" className="button button-secondary">
                Explore services
              </Link>
            </div>
          </div>

          <aside className="campaign-card">
            <div className="campaign-card-top">
              <span className="mini-label">How a campaign moves</span>
              <span className="campaign-index">4 steps</span>
            </div>
            <ol className="campaign-steps">
              {steps.map((step, i) => (
                <li key={step} className="campaign-step">
                  <span className="step-number">{i + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
            <div className="campaign-card-footer">
              Payment happens after your campaign is scoped and agreed —
              never during the initial request.
            </div>
          </aside>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip">
        <div className="container-content stats-grid">
          <div className="stat">
            <strong>3</strong>
            <span>campaign systems</span>
          </div>
          <div className="stat">
            <strong>24h</strong>
            <span>first review window</span>
          </div>
          <div className="stat">
            <strong>1</strong>
            <span>growth brief</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>real participants</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="container-content">
          <div className="section-heading">
            <span className="section-tag">Campaign capability</span>
            <h2>Campaigns across the places that matter to your audience</h2>
          </div>

          <div className="category-grid">
            {categories.map((cat) => {
              const catServices = services.filter((s) => s.category === cat.name);
              return (
                <article key={cat.name} className="category-tile">
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-description">{cat.description}</p>
                  <ul className="category-list">
                    {catServices.slice(0, 5).map((s) => (
                      <li key={s.id}>
                        <Link href={`/services/${s.slug}`}>
                          {s.name.replace(" Campaigns", "")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOM BAND */}
      <section className="custom-band">
        <div className="container-content custom-band-inner">
          <div>
            <h2>Have something different in mind?</h2>
            <p>
              If your campaign doesn&apos;t fit a standard service, describe it
              directly and our team will scope it from scratch.
            </p>
          </div>
          <Link href="/campaign/request" className="button button-outline">
            Start a custom campaign
          </Link>
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="principle-section">
        <div className="container-content">
          <blockquote>
            “LaunchGate does not sell numbers. LaunchGate builds and manages
            campaigns.”
          </blockquote>
        </div>
      </section>
    </div>
  );
}