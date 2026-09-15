import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-content site-header-inner">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark">LG</span>
          <span className="site-logo-word">LaunchGate</span>
        </Link>

        <nav className="main-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="main-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/campaign/request" className="button header-cta">
          Start a campaign
        </Link>
      </div>
    </header>
  );
}