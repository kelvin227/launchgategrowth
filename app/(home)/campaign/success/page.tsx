import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "We review your request",
    body: "Your campaign details are reviewed by our Growth Team.",
  },
  {
    n: "02",
    title: "We contact you",
    body: "We reach out to discuss your goals and requirements directly.",
  },
  {
    n: "03",
    title: "We prepare your offer",
    body: "We structure a campaign — audience, timing, and price — around your request.",
  },
  {
    n: "04",
    title: "We launch",
    body: "Once everything is agreed and payment is completed, campaign preparation begins.",
  },
];

export default function CampaignSuccessPage() {
  return (
    <div className="public-page success-page">
      <div className="container-content public-content">
        <div className="success-hero">
          <span className="success-mark" aria-hidden="true">✓</span>
          <p className="public-kicker">Request received</p>
          <h1>Campaign request received.</h1>
          <p className="success-description">
            Thank you for choosing LaunchGate. Our Growth Team will review your
            campaign requirements and contact you shortly to discuss the
            campaign structure, timing, audience, and next steps.
          </p>
        </div>

        <section className="success-steps">
          <div className="public-section-heading">
            <span className="public-index">Next</span>
            <h2>What happens from here</h2>
            <span className="public-heading-rule" aria-hidden="true" />
          </div>
          <div className="success-step-grid">
            {steps.map((step) => (
              <article key={step.n} className="success-step-card">
                <span className="success-step-number">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="success-actions">
          <Link href="/contact" className="button button-primary">
            Contact LaunchGate
          </Link>
          <Link href="/" className="button button-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
