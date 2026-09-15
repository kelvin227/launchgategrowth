"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Service = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  helpsWith: string[];
  tiers: Array<{ name: string; description: string }>;
  active: boolean;
  icon: string;
};

const SERVICES_CACHE_KEY = "launchgate-service-catalog";
const SERVICES_CACHE_TTL = 1000 * 60 * 60;

const contactOptions = [
  { label: "Email", value: "EMAIL" },
  { label: "Telegram", value: "TELEGRAM" },
  { label: "WhatsApp", value: "WHATSAPP" },
  { label: "Phone", value: "PHONE" },
];

const platformOptions = [
  "YouTube",
  "Instagram",
  "TikTok",
  "X",
  "Telegram",
  "Discord",
  "Spotify",
  "Local / Real-world",
  "Web3",
  "App",
  "Website",
  "Other",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-emerald-800/60 bg-black/30 px-4 py-3 text-sm text-emerald-50 placeholder:text-emerald-900 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

const steps = [
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
  { id: "campaign", label: "Campaign" },
  { id: "review", label: "Review" },
];

function Field({ label, required, children, hint }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="request-field block">
      <span className="request-label block text-sm font-medium text-emerald-200 mb-1">
        {label} {required && <span className="required-dot text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="request-hint block text-xs text-emerald-400/60 mt-1">{hint}</span>}
    </label>
  );
}

export default function CampaignRequestPage() {
  return (
    <Suspense fallback={<div className="request-loading-card"><span className="request-loading-icon">✦</span><span>Preparing campaign request…</span></div>}>
      <CampaignRequestForm />
    </Suspense>
  );
}

function CampaignRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(preselected);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Open/Close states for cards
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(SERVICES_CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { fetchedAt: number; services: Service[] };
        if (Date.now() - parsed.fetchedAt < SERVICES_CACHE_TTL) {
          setServices(parsed.services);
          setLoadingServices(false);
          return;
        }
      } catch {
        localStorage.removeItem(SERVICES_CACHE_KEY);
      }
    }

    fetch("/api/services")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load services");
        }
        return response.json();
      })
      .then((data) => {
        const payload = data.services as Service[];
        setServices(payload);
        localStorage.setItem(
          SERVICES_CACHE_KEY,
          JSON.stringify({ fetchedAt: Date.now(), services: payload })
        );
      })
      .catch(() => setError("Unable to load available services right now."))
      .finally(() => setLoadingServices(false));
  }, []);

  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    contactPersonName: "",
    businessEmail: "",
    telegramHandle: "",
    phoneNumber: "",
    preferredContactMethod: "",
    campaignGoal: "",
    targetPlatforms: [] as string[],
    targetCountry: "",
    startDate: "",
    duration: "",
    estimatedBudget: "",
    campaignUrl: "",
    additionalNotes: "",
    supportingLinks: "",
  });

  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [serviceSlug]
  );

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm({ ...form, [key]: value });
  }

  function togglePlatform(platform: string) {
    const targetPlatforms = form.targetPlatforms.includes(platform)
      ? form.targetPlatforms.filter((p) => p !== platform)
      : [...form.targetPlatforms, platform];

    updateForm("targetPlatforms", targetPlatforms);
  }

  function goNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    handleSubmit();
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        companyName: form.companyName.trim(),
        website: form.website.trim(),
        industry: form.industry.trim(),
        contactPersonName: form.contactPersonName.trim(),
        businessEmail: form.businessEmail.trim(),
        telegramHandle: form.telegramHandle.trim(),
        phoneNumber: form.phoneNumber.trim(),
        preferredContactMethod: form.preferredContactMethod,
        serviceSlug,
        campaignGoal: form.campaignGoal.trim(),
        targetPlatforms: form.targetPlatforms,
        targetCountry: form.targetCountry.trim(),
        startDate: form.startDate || null,
        duration: form.duration.trim(),
        estimatedBudget: form.estimatedBudget.trim(),
        campaignUrl: form.campaignUrl.trim(),
        additionalNotes: form.additionalNotes.trim(),
        supportingLinks: form.supportingLinks
          .split(/\n|,/)
          .map((x) => x.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/campaign/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "The campaign request could not be submitted.");
        setSubmitting(false);
        return;
      }

      router.push("/campaign/success");
    } catch (err) {
      setError("The request could not be sent. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center px-4 py-8">
      {/* 
        Container layout: 
        - Mobile: Flex-col (Text card at top, Form card at bottom)
        - Desktop (lg): Flex-row side-by-side 
      */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start justify-center">
        
        {/* TEXT / INTRO CARD */}
        <div className="w-full lg:w-1/3 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center cursor-pointer pb-4 border-b border-emerald-800/30" onClick={() => setIsIntroOpen(!isIntroOpen)}>
            <span className="section-tag text-xs uppercase tracking-wider text-emerald-400 font-semibold">Campaign request</span>
            <button className="text-emerald-400 text-sm focus:outline-none">
              {isIntroOpen ? "▲ Close" : "▼ Open"}
            </button>
          </div>

          <div className={`transition-all duration-300 overflow-hidden ${isIntroOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0"}`}>
            <h1 className="text-2xl font-bold text-emerald-50 mb-3">Tell us what you’re trying to achieve.</h1>
            <p className="text-sm text-emerald-300/80 mb-6 leading-relaxed">
              Fill in the details below. Our Growth Team reviews every request
              and reaches out to discuss the campaign structure, timing, and
              pricing — there’s nothing to pay right now.
            </p>

            <div className="request-progress pt-4 border-t border-emerald-800/30">
              <span className="request-step-label text-xs text-emerald-400 block mb-2">Request flow</span>
              <div className="request-step-track flex gap-2">
                {steps.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                      index === step 
                        ? "bg-emerald-600 border-emerald-400 text-white font-bold" 
                        : index < step 
                        ? "bg-emerald-900/40 border-emerald-700 text-emerald-300" 
                        : "bg-black/20 border-emerald-900/50 text-emerald-600"
                    }`}
                    onClick={() => setStep(index)}
                    aria-label={`Go to ${item.label}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="w-full lg:w-2/3 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center cursor-pointer pb-4 border-b border-emerald-800/30" onClick={() => setIsFormOpen(!isFormOpen)}>
            <div>
              <span className="request-form-kicker text-xs text-emerald-400 font-semibold block">Step {step + 1} of {steps.length}</span>
              <h2 className="text-xl font-bold text-emerald-50">{steps[step].label}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="request-form-total text-xs text-emerald-400/60 hidden sm:inline">LaunchGate intake</span>
              <button className="text-emerald-400 text-sm focus:outline-none">
                {isFormOpen ? "▲ Close" : "▼ Open"}
              </button>
            </div>
          </div>

          <div className={`transition-all duration-300 overflow-hidden ${isFormOpen ? "max-h-[2000px] opacity-100 pt-6" : "max-h-0 opacity-0 pt-0"}`}>
            {error && <div className="request-error p-3 mb-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-sm">{error}</div>}

            <form className="request-form space-y-4" onSubmit={(e) => { e.preventDefault(); goNext(); }}>
              {loadingServices && (
                <div className="request-loading-card flex items-center gap-2 text-emerald-300 py-4">
                  <span className="request-loading-icon animate-spin">✦</span>
                  <span>Loading service catalogue…</span>
                </div>
              )}

              {step === 0 && (
                <div className="request-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="request-field-group sm:col-span-2">
                    <Field label="Company / Project name" required>
                      <input required className={inputClass} placeholder="Acme Media" value={form.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
                    </Field>
                  </div>

                  <Field label="Website">
                    <input className={inputClass} placeholder="acmemedia.io" value={form.website} onChange={(e) => updateForm("website", e.target.value)} />
                  </Field>

                  <Field label="Industry / Category" required>
                    <input required className={inputClass} placeholder="Fintech, Events, Web3..." value={form.industry} onChange={(e) => updateForm("industry", e.target.value)} />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="request-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Contact person" required>
                    <input required className={inputClass} placeholder="Full name" value={form.contactPersonName} onChange={(e) => updateForm("contactPersonName", e.target.value)} />
                  </Field>

                  <Field label="Business email" required>
                    <input required type="email" className={inputClass} placeholder="you@company.com" value={form.businessEmail} onChange={(e) => updateForm("businessEmail", e.target.value)} />
                  </Field>

                  <Field label="Telegram">
                    <input className={inputClass} placeholder="@username" value={form.telegramHandle} onChange={(e) => updateForm("telegramHandle", e.target.value)} />
                  </Field>

                  <Field label="WhatsApp / Phone">
                    <input className={inputClass} placeholder="+234 ..." value={form.phoneNumber} onChange={(e) => updateForm("phoneNumber", e.target.value)} />
                  </Field>

                  <div className="request-field-group sm:col-span-2">
                    <Field label="Preferred contact method" required>
                      <select required className={inputClass} value={form.preferredContactMethod} onChange={(e) => updateForm("preferredContactMethod", e.target.value)}>
                        <option value="">Select a method</option>
                        {contactOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="request-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="request-field-group sm:col-span-2">
                    <Field label="Service" required>
                      <select required className={inputClass} value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>
                        <option value="" disabled>Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.slug}>{service.name}</option>
                        ))}
                      </select>
                    </Field>
                    {selectedService && (
                      <div className="request-service-card mt-3 p-4 bg-emerald-900/10 border border-emerald-800/30 rounded-xl">
                        <div className="request-service-card-top flex items-center gap-2 mb-2">
                          <span className="request-service-icon text-lg">{selectedService.icon}</span>
                          <span className="request-service-category text-xs font-semibold text-emerald-400 uppercase tracking-wide">{selectedService.category}</span>
                        </div>
                        <p className="request-service-copy text-sm text-emerald-200/80 mb-3">{selectedService.shortDescription}</p>
                        <div className="request-service-list flex flex-wrap gap-1">
                          {(selectedService.helpsWith ?? []).slice(0, 4).map((help) => (
                            <span key={help} className="request-service-pill text-xs px-2 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/30">{help}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="request-field-group sm:col-span-2">
                    <Field label="Campaign goal" required hint="What are you trying to achieve?">
                      <textarea required rows={4} className={inputClass} placeholder="Grow channel awareness ahead of our product launch..." value={form.campaignGoal} onChange={(e) => updateForm("campaignGoal", e.target.value)} />
                    </Field>
                  </div>

                  <div className="request-field-group sm:col-span-2">
                    <Field label="Target platforms" required hint="Choose where your campaign should move">
                      <div className="platform-grid flex flex-wrap gap-2 mt-2">
                        {platformOptions.map((platform) => (
                          <button
                            key={platform}
                            type="button"
                            className={`platform-chip px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              form.targetPlatforms.includes(platform)
                                ? "bg-emerald-600 border-emerald-400 text-white"
                                : "bg-black/30 border-emerald-800/60 text-emerald-300 hover:border-emerald-600"
                            }`}
                            onClick={() => togglePlatform(platform)}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>

                  <Field label="Target country / region">
                    <input className={inputClass} placeholder="Nigeria, Global..." value={form.targetCountry} onChange={(e) => updateForm("targetCountry", e.target.value)} />
                  </Field>

                  <Field label="Preferred start date">
                    <input type="date" className={inputClass} value={form.startDate} onChange={(e) => updateForm("startDate", e.target.value)} />
                  </Field>

                  <Field label="Campaign duration">
                    <input className={inputClass} placeholder="4 weeks" value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} />
                  </Field>

                  <Field label="Estimated budget">
                    <input className={inputClass} placeholder="$500" value={form.estimatedBudget} onChange={(e) => updateForm("estimatedBudget", e.target.value)} />
                  </Field>

                  <div className="request-field-group sm:col-span-2">
                    <Field label="Campaign / product URL">
                      <input className={inputClass} placeholder="https://" value={form.campaignUrl} onChange={(e) => updateForm("campaignUrl", e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="request-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="request-field-group sm:col-span-2">
                    <Field label="Additional details / requirements">
                      <textarea rows={4} className={inputClass} placeholder="Anything else we should know?" value={form.additionalNotes} onChange={(e) => updateForm("additionalNotes", e.target.value)} />
                    </Field>
                  </div>

                  <div className="request-field-group sm:col-span-2">
                    <Field label="Supporting files / links" hint="Optional — share a Drive link, brand kit, or reference.">
                      <textarea rows={4} className={inputClass} placeholder="https://" value={form.supportingLinks} onChange={(e) => updateForm("supportingLinks", e.target.value)} />
                    </Field>
                  </div>

                  <div className="review-card sm:col-span-2 p-4 rounded-xl bg-black/40 border border-emerald-800/50 mt-2">
                    <div className="review-card-grid grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-sm text-emerald-200">
                      <span className="flex flex-col"><small className="text-emerald-400/60 text-xs">Company</small>{form.companyName || "—"}</span>
                      <span className="flex flex-col"><small className="text-emerald-400/60 text-xs">Contact</small>{form.contactPersonName || "—"}</span>
                      <span className="flex flex-col"><small className="text-emerald-400/60 text-xs">Service</small>{selectedService?.name ?? "—"}</span>
                      <span className="flex flex-col"><small className="text-emerald-400/60 text-xs">Budget</small>{form.estimatedBudget || "—"}</span>
                    </div>
                    <div className="review-summary pt-3 border-t border-emerald-800/30">
                      <span className="review-summary-heading block text-xs font-semibold text-emerald-400 mb-1">Brief snapshot</span>
                      <p className="text-sm text-emerald-300/80">{form.campaignGoal || "No campaign goal added yet."}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="request-form-actions flex justify-between items-center pt-6 border-t border-emerald-800/30 mt-6">
                <button type="button" className="button button-outline px-4 py-2 rounded-xl border border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/40 disabled:opacity-50" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Back</button>

                {step < steps.length - 1 ? (
                  <button type="submit" className="button button-primary px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium">Continue</button>
                ) : (
                  <button type="submit" className="button button-primary px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit request"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}