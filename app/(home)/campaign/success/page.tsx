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
    <div className="container-content py-24">
      <div className="max-w-lg">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-moss/40 bg-moss/15 text-moss">
          ✓
        </span>
        <h1 className="mt-6 font-display text-4xl text-ink-50">
          Campaign request received.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-ink-400">
          Thank you for choosing LaunchGate. Our Growth Team will review your
          campaign requirements and contact you shortly to discuss the
          campaign structure, timing, audience, and next steps.
        </p>
      </div>

      <div className="mt-16 max-w-2xl divide-y divide-line border-y border-line">
        {steps.map((step) => (
          <div key={step.n} className="flex gap-6 py-6">
            <span className="font-display text-lg text-ink-500">{step.n}</span>
            <div>
              <p className="text-sm text-ink-50">{step.title}</p>
              <p className="mt-1 text-sm text-ink-400">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400"
        >
          Contact LaunchGate
        </Link>
        <Link
          href="/"
          className="rounded-sm px-6 py-3 text-sm font-medium text-ink-400 transition-colors hover:text-ink-100"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}