import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-content footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">LaunchGate</p>
          <p className="footer-copy">
            LaunchGate does not sell numbers. LaunchGate builds and manages
            campaigns, structured around your goal by a team that reviews
            every request.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <p className="footer-heading">Company</p>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Campaigns</p>
            <ul>
              <li><Link href="/services">All services</Link></li>
              <li><Link href="/campaign/request">Start a campaign</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Team</p>
            <ul>
              <li><Link href="/admin">Admin panel</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-content">
          © 2026 LaunchGate. All campaigns are reviewed before acceptance.
        </div>
      </div>
    </footer>
  );
}