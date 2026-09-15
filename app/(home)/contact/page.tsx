import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container-content py-20">
      <div className="grid gap-16 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-sm text-signal-bright">Contact</p>
          <h1 className="mt-4 font-display text-4xl text-ink-50">
            Talk to the Growth Team.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-400">
            Already submitted a campaign request? Our team will reach out
            directly. For anything else, reach us here.
          </p>

          <dl className="mt-10 space-y-6 border-t border-line pt-8 text-sm">
            <div>
              <dt className="text-ink-500">Email</dt>
              <dd className="mt-1 text-ink-100">hello@launchgate.co</dd>
            </div>
            <div>
              <dt className="text-ink-500">Telegram</dt>
              <dd className="mt-1 text-ink-100">@launchgate</dd>
            </div>
            <div>
              <dt className="text-ink-500">Response time</dt>
              <dd className="mt-1 text-ink-100">Within one business day</dd>
            </div>
          </dl>

          <Link
            href="/campaign/request"
            className="mt-10 inline-block rounded-sm bg-signal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-bright"
          >
            Start a campaign instead
          </Link>
        </div>

        <form className="space-y-6">
          <label className="block">
            <span className="text-sm text-ink-200">Name</span>
            <input className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="Your name" />
          </label>
          <label className="block">
            <span className="text-sm text-ink-200">Email</span>
            <input type="email" className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="you@company.com" />
          </label>
          <label className="block">
            <span className="text-sm text-ink-200">Message</span>
            <textarea rows={5} className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="How can we help?" />
          </label>
          <button
            type="submit"
            className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}