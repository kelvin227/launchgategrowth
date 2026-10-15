"use client";
import { Copy, CopyCheck } from "lucide-react";
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
        return;
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
      setError(error instanceof Error ? error.message : "Failed to send message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="public-page contact-page">
      <div className="container-content public-content">
      <div className="public-contact-layout">
        <div className="public-contact-copy">
          <p className="public-kicker">Get in touch</p>
          <h1>
            Talk to the Growth Team.
          </h1>
          <p className="contact-intro">
            Already submitted a campaign request? Our team will reach out
            directly. For anything else, reach us here.
          </p>

          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>hello@launchgate.co</dd>
            </div>
            <div>
              <dt>Telegram</dt>
              <dd>@launchgate</dd>
            </div>
            <div>
              <dt>Response time</dt>
              <dd>Within one business day</dd>
            </div>
          </dl>

          <Link
            href="/campaign/request"
            className="button button-secondary"
          >
            Start a campaign instead
          </Link>
        </div>

        <form className={`contact-form${success && error === "" ? " is-hidden" : ""}`} onSubmit={handleSubmit}>
          {error && <p className="contact-error" role="alert">{error}</p>}
          <label className="block">
            <span>Name</span>
            <input className="contact-input" placeholder="Your name" value={name} onChange={(e) => {setName(e.target.value) }} />
          </label>
          <label className="block">
            <span>Email</span>
            <input type="email" className="contact-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
            <label className="block">
            <span>Company Name</span>
            <input className="contact-input" placeholder="Your company" value={company} onChange={(e) => setCompany(e.target.value)}/>
          </label>
          <label className="block">
            <span>Message</span>
            <textarea rows={5} className="contact-input" placeholder="How can we help?"  value={message} onChange={(e) => setMessage(e.target.value)}/>
          </label>
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
        
        <div className={`contact-success${success && error === "" ? "" : " is-hidden"}`}>
          <div className="contact-success-card">
            <p className="public-kicker">Message received</p>
            <h2>
              Your contact request has been received.
            </h2>
            <p>
              Thanks for reaching out. We&apos;ll get back to you within one
              business day.
            </p>
            <p className="tracking-id">
              Tracking ID: <span>{copied ? (
                <>
                  {trackingId} <button type="button" aria-label="Copy tracking ID" onClick={() => handleCopy(trackingId)}><CopyCheck size={18}/></button>
                </>
                ):
                (
                <>
                    {trackingId}<button type="button" aria-label="Copy tracking ID" onClick={() => handleCopy(trackingId)}><Copy size={18}/></button>
                  </>
              )
                }
                </span>
            </p>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}