import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminContactComp from "@/components/admin/contactComp";

export default async function AdminContactPage() {
    const session = await auth();
    if(!session) {
      redirect("/admin/login");
    }

  return (
    <AdminContactComp />
  );
}
