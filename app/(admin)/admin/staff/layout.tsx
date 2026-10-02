import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StaffManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/staff");

  return children;
}