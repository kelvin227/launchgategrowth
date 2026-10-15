import Link from "next/link";

const principles = [
  {
    title: "Fewer campaigns, higher quality",
    body: "We'd rather run one well-scoped campaign than ten generic ones. Every request is reviewed before we agree to anything.",
  },
  {
    title: "Real people, real participation",
    body: "There are no bots, no fake numbers, and no guaranteed follower counts. There are campaigns, structured around a goal.",
  },
  {
    title: "Managed, not automated",
    body: "A person on our Growth Team evaluates geography, eligibility, timing, and budget before any offer is made.",
  },
];

export default function AboutPage() {
  return (
    <div className="public-page about-page">
      <section className="public-hero">
        <div className="container-content">
          <div className="public-hero-copy">
            <p className="public-kicker">About LaunchGate</p>
            <h1>We build campaigns. We don&apos;t sell numbers.</h1>
            <p>
              LaunchGate exists because most growth services promise a count —
              followers, views, installs — with no regard for whether it
              actually helps. We work the other way: you bring a goal, and our
              team structures a campaign around it.
            </p>
          </div>
        </div>
      </section>

      <section className="container-content public-content">
        <div className="public-section-heading">
          <span className="public-index">01</span>
          <h2>How we work</h2>
          <span className="public-heading-rule" aria-hidden="true" />
        </div>
        <div className="principle-grid">
          {principles.map((principle, index) => (
            <article key={principle.title} className="principle-card">
              <span className="principle-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-content public-content">
        <div className="public-cta-band">
          <div>
            <p className="public-kicker">Your goal comes first</p>
            <h2>Ready to start?</h2>
            <p>
              Tell us what you&apos;re trying to achieve and we&apos;ll take it from there.
            </p>
          </div>
          <Link href="/campaign/request" className="button button-primary">
            Start a campaign
          </Link>
        </div>
      </section>
    </div>
  );
}
