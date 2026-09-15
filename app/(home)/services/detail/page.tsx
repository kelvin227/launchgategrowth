import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true },
  });

  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug, active: true },
  });

  if (!service) notFound();

  return (
    <div>
      <section className="border-b border-line/70">
        <div className="container-content py-20">
          <Link href="/services" className="text-sm text-ink-400 hover:text-ink-100">
            ← All services
          </Link>
          <p className="mt-6 text-sm text-signal-bright">{service.category}</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl text-ink-50 md:text-5xl">
            {service.name}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-300">
            {service.description}
          </p>
          <Link
            href={`/campaign/request?service=${service.slug}`}
            className="mt-10 inline-block rounded-sm bg-signal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-bright"
          >
            Start campaign
          </Link>
        </div>
      </section>

      <section className="container-content grid gap-16 py-20 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-xl text-ink-100">What we can help with</h2>
          <ul className="mt-6 space-y-3">
            {(service.helpsWith ?? []).map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-300">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal-bright" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink-100">Campaign types</h2>
          <p className="mt-2 text-sm text-ink-400">
            The team determines the final campaign structure and price after
            reviewing your request.
          </p>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {(service.tiers as Array<{name: string; description: string}> ?? []).map((tier) => (
              <div key={tier.name} className="py-5">
                <p className="text-sm text-ink-50">{tier.name}</p>
                <p className="mt-1 text-sm text-ink-400">{tier.description}</p>
              </div>
            ))}
          </div>
          <Link
            href={`/campaign/request?service=${service.slug}`}
            className="mt-8 inline-block text-sm text-signal-bright hover:text-signal-bright/80"
          >
            Request this campaign
          </Link>
        </div>
      </section>
    </div>
  );
}