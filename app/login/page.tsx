import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
	title: "Sign in — LaunchGate",
	description: "Sign in to your LaunchGate campaign workspace.",
};

export default function LoginPage() {
	return (
		<div className="login-page">
			<div className="container-content login-layout">
				<section className="login-intro" aria-labelledby="login-title">
					<div className="section-tag">Campaign workspace</div>
					<h1 id="login-title">
						Keep the <span>momentum</span> moving.
					</h1>
					<p>
						Sign in to follow campaign progress, review your growth brief, and
						stay close to the work your audience can feel.
					</p>

					<div className="login-signal" aria-label="LaunchGate workspace features">
						<div>
							<strong>01</strong>
							<span>One shared brief</span>
						</div>
						<div>
							<strong>24h</strong>
							<span>First review window</span>
						</div>
					</div>
				</section>

				<LoginForm />
			</div>
		</div>
	);
}
