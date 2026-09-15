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
    <div className="container-content py-20">
      <div className="max-w-xl">
        <p className="text-sm text-signal-bright">Services</p>
        <h1 className="mt-4 font-display text-4xl text-ink-50">
          Every campaign starts with a goal, not a package.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-ink-400">
          Choose the platform or setting you want to reach people in. The
          exact campaign structure — audience, timing, and budget — is
          scoped with our team after you submit a request.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {categoryOrder.map((category) => {
          const items = services.filter((s) => s.category === category && s.active);
          return (
            <div key={category}>
              <h2 className="border-b border-line/70 pb-3 font-display text-xl text-ink-100">
                {category}
              </h2>
              <div className="mt-6 grid gap-px overflow-hidden border border-line/70 bg-line/70 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group flex flex-col justify-between bg-ink p-6 transition-colors hover:bg-field"
                  >
                    <div>
                      <p className="text-base text-ink-50">{service.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-400">
                        {service.description}
                      </p>
                    </div>
                    <span className="mt-6 text-xs text-signal-bright opacity-0 transition-opacity group-hover:opacity-100">
                      View service
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line/70 pt-10 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl text-ink-50">Have something different in mind?</p>
          <p className="mt-1 text-sm text-ink-400">Start a custom campaign and describe your goal directly.</p>
        </div>
        <Link
          href="/campaign/request"
          className="whitespace-nowrap rounded-sm bg-signal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-bright"
        >
          Start a custom campaign
        </Link>
      </div>
    </div>
  );
}