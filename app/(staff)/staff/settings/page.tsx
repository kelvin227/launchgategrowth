import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
    const session = await auth();
    if(!session) {
      redirect("/admin/login");
    }
  return (
    <div className="admin-settings">
      <section className="admin-page-head">
        <div>
          <span className="admin-kicker">Platform</span>
          <h1 className="admin-title">Settings</h1>
        </div>
      </section>

      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-panel-kicker">Operating controls</span>
            <h2>Workspace settings</h2>
          </div>
          <span className="admin-count-badge">Synced</span>
        </div>

        <div className="admin-settings-grid">
          <article className="admin-settings-card">
            <span className="admin-settings-label">Campaign intake</span>
            <span className="admin-settings-value">Enabled</span>
          </article>
          <article className="admin-settings-card">
            <span className="admin-settings-label">Review window</span>
            <span className="admin-settings-value">24h</span>
          </article>
          <article className="admin-settings-card">
            <span className="admin-settings-label">Partner channel</span>
            <span className="admin-settings-value">LaunchGate</span>
          </article>
        </div>
      </section>
    </div>
  );
}
