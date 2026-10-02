import { AdminShell } from "@/components/staff/staff-shell";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchGate — Managed Campaigns",
  description:
    "You set the goal. We build the campaign. Real people create the impact.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
   if(session.user && session.user.role !== "STAFF"){
    console.log("User role is not admin or staff, redirecting to home page.");
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
