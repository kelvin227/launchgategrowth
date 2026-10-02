"use client";

import { useState } from "react";
import { Check, Eye, Mail, Send } from "lucide-react";

type EmailComposerProps = {
  replyTo: string;
  fromAddress: string;
};

export function EmailComposer({ replyTo, fromAddress }: EmailComposerProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [auditWarning, setAuditWarning] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setSent(false);
    setAuditWarning(false);
    setError("");

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to send email.");
      setSent(true);
      setAuditWarning(data.auditRecorded === false);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send email.");
    } finally {
      setIsSending(false);
    }
  }

  const canSend = Boolean(to.trim() && subject.trim() && message.trim());

  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Client communication</span>
          <h1 className="admin-title">Compose email</h1>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <form onSubmit={handleSend} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text)]">To</span>
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setSent(false);
              }}
              placeholder="client@company.com"
              className="w-full border border-[var(--line)] bg-[var(--page-bg-soft)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted-soft)] outline-none focus:border-[var(--gold)]"
            />
          </label>

          <div className="border border-[var(--line-soft)] bg-[var(--page-bg-elevated)] px-4 py-3">
            <span className="block text-xs uppercase tracking-wider text-[var(--muted-soft)]">Reply-to</span>
            <span className="mt-1 flex items-center gap-2 break-all text-sm text-[var(--sage-light)]">
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
              {replyTo || "No email is assigned to this account"}
            </span>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text)]">Subject</span>
            <input
              required
              maxLength={180}
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setSent(false);
              }}
              placeholder="A clear subject for your client"
              className="w-full border border-[var(--line)] bg-[var(--page-bg-soft)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted-soft)] outline-none focus:border-[var(--gold)]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text)]">Message</span>
            <textarea
              required
              rows={10}
              maxLength={10000}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setSent(false);
              }}
              placeholder="Write your message..."
              className="w-full resize-y border border-[var(--line)] bg-[var(--page-bg-soft)] px-4 py-3 text-sm leading-6 text-[var(--text)] placeholder:text-[var(--muted-soft)] outline-none focus:border-[var(--gold)]"
            />
            <span className="mt-1 block text-right text-xs text-[var(--muted-soft)]">{message.length}/10,000</span>
          </label>

          {error && <p role="alert" className="border border-rose-400/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">{error}</p>}
          {sent && <p role="status" className="border border-emerald-400/30 bg-emerald-950/25 px-4 py-3 text-sm text-[var(--sage-light)]">Email sent successfully.</p>}
          {auditWarning && <p role="status" className="border border-amber-400/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-200">Email was sent, but its activity record could not be saved. Contact an administrator before retrying.</p>}

          <button
            type="submit"
            disabled={!canSend || isSending}
            className="inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--page-bg)] transition hover:bg-[var(--sage-light)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            {isSending ? "Sending..." : "Send email"}
          </button>
        </form>

        <aside aria-label="Email preview" className="min-w-0 border border-[var(--line)] bg-[var(--card)]">
          <div className="flex items-center gap-2 border-b border-[var(--line-soft)] px-5 py-4">
            <Eye aria-hidden="true" className="h-4 w-4 text-[var(--gold)]" />
            <h2 className="text-sm font-semibold text-[var(--text)]">Review email</h2>
          </div>
          <div className="space-y-4 p-5">
            <div className="border-b border-[var(--line-soft)] pb-3">
              <p className="text-xs text-[var(--muted-soft)]">FROM</p>
              <p className="mt-1 break-all text-sm text-[var(--text)]">{fromAddress}</p>
            </div>
            <div className="border-b border-[var(--line-soft)] pb-3">
              <p className="text-xs text-[var(--muted-soft)]">TO</p>
              <p className="mt-1 break-all text-sm text-[var(--text)]">{to || "Recipient will appear here"}</p>
            </div>
            <div className="border-b border-[var(--line-soft)] pb-3">
              <p className="text-xs text-[var(--muted-soft)]">SUBJECT</p>
              <p className="mt-1 break-words text-sm font-medium text-[var(--text)]">{subject || "Subject will appear here"}</p>
            </div>
            <div className="min-h-60 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--muted)]">
              {message || "Your message preview will appear here as you write."}
            </div>
            {sent && <p className="flex items-center gap-2 border-t border-[var(--line-soft)] pt-4 text-xs text-[var(--sage-light)]"><Check aria-hidden="true" className="h-4 w-4" />Sent to {to}</p>}
          </div>
        </aside>
      </div>
      <p className="mt-6 max-w-3xl text-xs leading-5 text-[var(--muted-soft)]">Messages are sent from LaunchGate. Replies go to your assigned account email. Sending is limited to 5 emails per account every 10 minutes.</p>
    </div>
  );
}