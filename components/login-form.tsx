"use client";

import Link from "next/link";
import { useState } from "react";
import { Login } from "@/lib/function/authaction";
import { useRouter } from "next/navigation";

type LoginFormProps = {
    audience?: "advertiser" | "team";
};

export function LoginForm({ audience = "advertiser" }: LoginFormProps) {
    const isTeamLogin = audience === "team";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        const result = await Login(email, password, audience);

        if (result.redirect) {
            router.push(result.redirect);
            return;
        }

        setMessage(result.message || "Unable to sign in. Please try again.");
        setIsSubmitting(false);
    }

    return (
        <section className="login-panel" aria-label="Sign in form">
            <div className="login-panel-heading">
                <span className="mini-label">{isTeamLogin ? "Team access" : "Welcome back"}</span>
                <span className="login-panel-mark">LG / {isTeamLogin ? "OPS" : "01"}</span>
            </div>

            <h2>{isTeamLogin ? "LaunchGate operations" : "Sign in to LaunchGate"}</h2>
            <p className="login-panel-copy">
                {isTeamLogin
                    ? "Sign in with your team account to manage campaigns, services, and incoming requests."
                    : "Access your campaign workspace and keep your next move in sight."}
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={isTeamLogin ? "you@launchgate.com" : "you@company.com"}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <div className="login-label-row">
                    <label htmlFor="password">Password</label>
                    <span className="login-hint">Keep it private</span>
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {message ? <p className="login-error" role="alert">{message}</p> : null}

                <button className="button button-primary login-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className="login-panel-footer">
                <span>{isTeamLogin ? "Looking for the public site?" : "Need a campaign first?"}</span>
                <Link href={isTeamLogin ? "/" : "/campaign/request"}>
                    {isTeamLogin ? "Back to LaunchGate" : "Start a request"}
                </Link>
            </div>
        </section>
    );
}