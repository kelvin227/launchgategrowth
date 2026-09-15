import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Team sign in — LaunchGate",
  description: "Sign in to the LaunchGate operations workspace.",
};

export default function TeamLoginPage() {
  return (
    <div className="login-page login-page-team">
      <div className="container-content login-layout">
        <section className="login-intro" aria-labelledby="team-login-title">
          <div className="section-tag">Internal operations</div>
          <h1 id="team-login-title">
            Run the work <span>behind</span> the impact.
          </h1>
          <p>
            The LaunchGate team workspace keeps every request, service, and
            campaign moving from first brief to live delivery.
          </p>

          <div className="login-signal" aria-label="Operations workspace features">
            <div>
              <strong>04</strong>
              <span>Operational views</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Shared campaign pipeline</span>
            </div>
          </div>
        </section>

        <LoginForm audience="team" />
      </div>
    </div>
  );
}