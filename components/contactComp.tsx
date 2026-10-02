"use client";
import { Clipboard, ClipboardCheck, Copy, CopyCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactComp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);

    const handleCopy = async (textToCopy: string) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      const payload = {
        email,
        name,
        message,
        company,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setSuccess(false);
        setError("Failed to send message");
      }

      const data = await response.json();

      setTrackingId(data.contact.trackingId);

      setSuccess(true);
      setEmail("");
      setError("");
      setName("");
      setMessage("");
    } catch (error) {
      setSuccess(false);
      setError(error as string);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
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

        <form className={success && error === "" ? "hidden" :"space-y-6"} onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-ink-200">Name</span>
            <input className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="Your name" value={name} onChange={(e) => {setName(e.target.value) }} />
          </label>
          <label className="block">
            <span className="text-sm text-ink-200">Email</span>
            <input type="email" className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
            <label className="block">
            <span className="text-sm text-ink-200">Company Name</span>
            <input className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="bitcoin group of investor" value={company} onChange={(e) => setCompany(e.target.value)}/>
          </label>
          <label className="block">
            <span className="text-sm text-ink-200">Message</span>
            <textarea rows={5} className="mt-2 w-full rounded-sm border border-line bg-field px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-signal focus:outline-none" placeholder="How can we help?"  value={message} onChange={(e) => setMessage(e.target.value)}/>
          </label>
          <button
            type="submit"
            className="rounded-sm border border-line px-6 py-3 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
        
        <div className={success && error === "" ? "space-y-6" : "hidden"}>
          <div className="rounded-sm border border-line bg-field p-8">
            <p className="text-sm text-signal-bright">Message received</p>
            <h2 className="mt-3 font-display text-2xl text-ink-50">
              Your contact request has been received.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Thanks for reaching out. We&apos;ll get back to you within one
              business day.
            </p>
            <p className="mt-6 text-sm text-ink-500">
              Tracking ID: <span className="text-ink-100 flex">{copied ? (
                <>
                  {trackingId} <CopyCheck size={18} onClick={ () => handleCopy(trackingId)}/> 
                </>
                ):
                (
                <>
                    {trackingId}<Copy size={18} onClick={ () => handleCopy(trackingId)}/>
                  </>
              )
                }
                </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}