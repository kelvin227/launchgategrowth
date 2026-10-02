"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/function/authaction";
import { PresenceHeartbeat } from "@/components/presence-heartbeat";

const nav = [
  { href: "/staff", label: "Dashboard", icon: "01" },
  { href: "/staff/campaigns", label: "Campaign requests", icon: "02" },
  { href: "/staff/contacts", label: "Contacts", icon: "03" },
  { href: "/staff/services", label: "Services", icon: "04" },
  { href: "/staff/email", label: "Email", icon: "05" },
  { href: "/staff/settings", label: "Settings", icon: "06" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-app">
      <PresenceHeartbeat />
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <Link href="/" className="admin-brand">
            <span className="admin-brand-mark">LG</span>
            <span>
              <span className="admin-brand-name">LaunchGate</span>
              <span className="admin-brand-subtitle">Operations</span>
            </span>
          </Link>
        </div>

        <div className="admin-sidebar-section">
          <span className="admin-section-label">Navigation</span>
          <nav className="admin-nav">
            {nav.map((item) => {
              const active =
                item.href === "/staff"
                  ? pathname === "/staff"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${active ? "active" : ""}`}
                >
                  <span className="admin-nav-index">{item.icon}</span>
                  <span className="admin-nav-label">{item.label}</span>
                  {active && <span className="admin-nav-orbit" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-foot">
          <Link href="/" className="admin-return-link">
            <span aria-hidden="true">←</span>
            <span>Back to site</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <section className="admin-topbar">
          <div>
            <span className="admin-topbar-kicker">LaunchGate Operations</span>
            <span className="admin-topbar-date">Staff workspace</span>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="admin-icon-button"
              aria-label="Log out"
              onClick={() => logout()}
            >
              <span>↪</span>
            </button>
          </div>
        </section>

        <section className="admin-content-wrap">{children}</section>
      </main>
    </div>
  );
}