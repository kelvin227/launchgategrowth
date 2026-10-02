import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EmailComposer } from "@/components/workspace/email-composer";

export default async function StaffEmailPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "STAFF") redirect("/admin/email");

  return (
    <EmailComposer
      replyTo={session.user.email ?? ""}
      fromAddress={process.env.RESEND_FROM_EMAIL || "No reply <no-reply@jbcapi.com>"}
    />
  );
}