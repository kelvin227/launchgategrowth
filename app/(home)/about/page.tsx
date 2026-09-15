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
    <div>
      <section className="border-b border-line/70">
        <div className="container-content py-20">
          <p className="text-sm text-signal-bright">About LaunchGate</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-ink-50 md:text-5xl">
            We build campaigns. We don't sell numbers.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300">
            LaunchGate exists because most growth services promise a count —
            followers, views, installs — with no regard for whether it
            actually helps. We work the other way: you bring a goal, and our
            team structures a campaign around it.
          </p>
        </div>
      </section>

      <section className="container-content py-20">
        <div className="grid gap-px overflow-hidden border border-line/70 bg-line/70 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="bg-ink p-8">
              <p className="text-base text-ink-50">{p.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line/70 bg-field">
        <div className="container-content flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl text-ink-50">Ready to start?</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-400">
              Tell us what you're trying to achieve and we'll take it from there.
            </p>
          </div>
          <Link
            href="/campaign/request"
            className="whitespace-nowrap rounded-sm bg-signal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-bright"
          >
            Start a campaign
          </Link>
        </div>
      </section>
    </div>
  );
}