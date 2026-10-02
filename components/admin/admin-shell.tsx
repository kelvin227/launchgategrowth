"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/function/authaction";
import { formattedDate } from "@/lib/utils";
import { PresenceHeartbeat } from "@/components/presence-heartbeat";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "01" },
  { href: "/admin/campaigns", label: "Campaign requests", icon: "02" },
  { href: "/admin/contacts", label: "Contacts", icon: "03" },
  { href: "/admin/services", label: "Services", icon: "04" },
  { href: "/admin/staff", label: "Staff", icon: "05"},
  { href: "/admin/activity", label: "Activity log", icon: "06" },
  { href: "/admin/email", label: "Email", icon: "07" },
  { href: "/admin/settings", label: "Settings", icon: "08" },
];

export function AdminShell({ children, role }: { children: React.ReactNode; role?: string }) {
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
            {nav
              .filter((item) => item.href !== "/admin/activity" || role === "ADMIN")
              .map((item) => item.href === "/admin/email" && role === "STAFF"
                ? { ...item, href: "/staff/email" }
                : item)
              .map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
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
            <span className="admin-topbar-kicker">LaunchGate Admin</span>
            <span className="admin-topbar-date">{formattedDate()}</span>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-icon-button" aria-label="Notifications">
              <span>◌</span>
            </button>
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