"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { ServiceInput, ServiceTier } from "@/lib/service-management";

type ServiceRecord = ServiceInput & { id: string };

const emptyService: ServiceInput = {
  name: "",
  slug: "",
  description: "",
  category: "Social & Content",
  icon: "campaign",
  helpsWith: [],
  tiers: [],
  active: true,
  sortOrder: 0,
};

function slugFromName(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function ServiceEditor({ basePath, service }: { basePath: string; service?: ServiceRecord }) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceInput>(service ?? emptyService);
  const [slugEdited, setSlugEdited] = useState(Boolean(service));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateTier(index: number, field: keyof ServiceTier, value: string) {
    setForm((current) => ({
      ...current,
      tiers: current.tiers.map((tier, tierIndex) => tierIndex === index ? { ...tier, [field]: value } : tier),
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const isNew = !service;
    const idempotencyKey = isNew ? crypto.randomUUID() : "";
    let lastError = "Unable to save this service right now.";

    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        const response = await fetch(isNew ? "/api/services" : `/api/services/${service.id}`, {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isNew ? { service: form, idempotencyKey } : form),
        });

        if (response.ok) {
          router.push(basePath);
          router.refresh();
          return;
        }

        const body = await response.json().catch(() => ({}));
        lastError = body.error ?? lastError;
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After") ?? 0);
          if (attempt < 3 && retryAfter > 0 && retryAfter <= 4) {
            await wait(retryAfter * 1000);
            continue;
          }
        } else if (response.status >= 500 && attempt < 3) {
          await wait(250 * 2 ** attempt);
          continue;
        }
        break;
      } catch {
        lastError = "Connection interrupted. Retrying the save…";
        if (attempt < 3) {
          await wait(250 * 2 ** attempt);
          continue;
        }
      }
    }

    setError(lastError);
    setSaving(false);
  }

  return (
    <div className="admin-service-editor">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Service catalog</span>
          <h1 className="admin-title">{service ? "Edit service" : "New service"}</h1>
        </div>
        <Link href={basePath} className="button button-secondary">Back to services</Link>
      </section>

      <form className="admin-service-form" onSubmit={submit}>
        <section className="admin-service-form-section">
          <div className="admin-service-form-heading">
            <span className="admin-panel-kicker">01 / Identity</span>
            <h2>Service details</h2>
          </div>
          <div className="admin-service-fields">
            <label className="admin-service-field">
              <span>Service name</span>
              <input required maxLength={100} value={form.name} onChange={(event) => setForm((current) => ({
                ...current,
                name: event.target.value,
                slug: slugEdited ? current.slug : slugFromName(event.target.value),
              }))} />
            </label>
            <label className="admin-service-field">
              <span>URL slug</span>
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} value={form.slug} onChange={(event) => {
                setSlugEdited(true);
                setForm((current) => ({ ...current, slug: slugFromName(event.target.value) }));
              }} />
            </label>
            <label className="admin-service-field">
              <span>Category</span>
              <input required maxLength={80} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
            </label>
            <label className="admin-service-field">
              <span>Icon key</span>
              <input required maxLength={80} value={form.icon} onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))} />
            </label>
            <label className="admin-service-field admin-service-field-wide">
              <span>Description</span>
              <textarea required rows={4} maxLength={3000} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
          </div>
        </section>

        <section className="admin-service-form-section">
          <div className="admin-service-form-heading">
            <span className="admin-panel-kicker">02 / Delivery</span>
            <h2>Capabilities and offer tiers</h2>
          </div>
          <label className="admin-service-field">
            <span>Capabilities <small>One per line</small></span>
            <textarea rows={5} maxLength={5000} value={form.helpsWith.join("\n")} onChange={(event) => setForm((current) => ({
              ...current,
              helpsWith: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
            }))} />
          </label>
          <div className="admin-service-tier-heading">
            <span>Offer tiers</span>
            <button className="admin-service-text-button" type="button" onClick={() => setForm((current) => ({
              ...current,
              tiers: [...current.tiers, { name: "", description: "" }],
            }))}>+ Add tier</button>
          </div>
          {form.tiers.length === 0 && <p className="admin-service-hint">No tiers added. You can add them now or leave the list empty.</p>}
          <div className="admin-service-tier-list">
            {form.tiers.map((tier, index) => (
              <div className="admin-service-tier-row" key={index}>
                <label className="admin-service-field">
                  <span>Tier name</span>
                  <input required maxLength={100} value={tier.name} onChange={(event) => updateTier(index, "name", event.target.value)} />
                </label>
                <label className="admin-service-field">
                  <span>Tier description</span>
                  <input required maxLength={500} value={tier.description} onChange={(event) => updateTier(index, "description", event.target.value)} />
                </label>
                <button className="admin-service-remove" type="button" aria-label={`Remove tier ${tier.name || index + 1}`} onClick={() => setForm((current) => ({
                  ...current,
                  tiers: current.tiers.filter((_, tierIndex) => tierIndex !== index),
                }))}>Remove</button>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-service-form-section admin-service-publishing">
          <div className="admin-service-form-heading">
            <span className="admin-panel-kicker">03 / Publishing</span>
            <h2>Visibility and order</h2>
          </div>
          <div className="admin-service-publish-fields">
            <label className="admin-service-field admin-service-order">
              <span>Sort order</span>
              <input type="number" min={0} max={100000} step={1} value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} />
            </label>
            <label className="admin-service-toggle">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />
              <span><strong>{form.active ? "Published" : "Archived"}</strong><small>{form.active ? "Visible in the public services catalog" : "Hidden from the public catalog"}</small></span>
            </label>
          </div>
        </section>

        {error && <p className="admin-service-error" role="alert">{error}</p>}
        <div className="admin-service-form-actions">
          <Link href={basePath} className="button button-secondary">Cancel</Link>
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : service ? "Save changes" : "Create service"}</button>
        </div>
      </form>
    </div>
  );
}