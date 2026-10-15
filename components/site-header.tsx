"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container-content site-header-inner">
        <div className="site-header-brand-row">
          <Link href="/" className="site-logo">
            <span className="site-logo-mark">LG</span>
            <span className="site-logo-word">LaunchGate</span>
          </Link>
          <button
            type="button"
            className="site-menu-toggle"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <nav className="site-nav site-nav-desktop" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/campaign/request" className="button button-primary site-header-cta">
          Start a campaign
        </Link>

        <nav
          id="site-navigation"
          className={`site-nav site-nav-mobile${open ? " is-open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!open}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/campaign/request" className="button button-primary" onClick={() => setOpen(false)}>
            Start a campaign
          </Link>
        </nav>
      </div>
    </header>
  );
}