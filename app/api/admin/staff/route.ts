import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN" ? session.user : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const staff = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      jobTitle: true,
      role: true,
      lastLoginAt: true,
      lastSeenAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const jobTitle = typeof body?.jobTitle === "string" ? body.jobTitle.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!name || !email || !jobTitle || password.length < 12) {
    return NextResponse.json({ error: "Name, work email, title, and a password of at least 12 characters are required." }, { status: 400 });
  }

  try {
    const staff = await prisma.user.create({
      data: {
        name,
        email,
        jobTitle,
        password: await bcrypt.hash(password, 12),
        role: "STAFF",
      },
      select: { id: true, name: true, email: true, jobTitle: true, role: true, lastLoginAt: true, lastSeenAt: true, createdAt: true },
    });
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        actorLabel: admin.name || admin.email || admin.id,
        action: "CREATE",
        entityType: "User",
        entityId: staff.id,
        details: { name: staff.name, email: staff.email, role: staff.role },
      },
    });
    return NextResponse.json({ staff }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That email address is already assigned to an account." }, { status: 409 });
    }
    console.error("Failed to create staff account:", error);
    return NextResponse.json({ error: "Failed to create staff account." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const jobTitle = typeof body?.jobTitle === "string" ? body.jobTitle.trim() : "";
  if (!id || !name || !email || !jobTitle) {
    return NextResponse.json({ error: "Staff ID, name, work email, and title are required." }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findFirst({ where: { id, role: "STAFF" }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Staff account not found." }, { status: 404 });

    const staff = await prisma.user.update({
      where: { id },
      data: { name, email, jobTitle },
      select: { id: true, name: true, email: true, jobTitle: true, role: true, lastLoginAt: true, lastSeenAt: true, createdAt: true },
    });
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        actorLabel: admin.name || admin.email || admin.id,
        action: "UPDATE",
        entityType: "User",
        entityId: staff.id,
        details: { name: staff.name, email: staff.email, jobTitle: staff.jobTitle },
      },
    });
    return NextResponse.json({ staff });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That email address is already assigned to an account." }, { status: 409 });
    }
    console.error("Failed to update staff account:", error);
    return NextResponse.json({ error: "Failed to update staff account." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Staff ID is required." }, { status: 400 });

  try {
    const staff = await prisma.user.findFirst({ where: { id, role: "STAFF" }, select: { id: true, name: true, email: true } });
    if (!staff) return NextResponse.json({ error: "Staff account not found." }, { status: 404 });

    await prisma.user.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        actorLabel: admin.name || admin.email || admin.id,
        action: "DELETE",
        entityType: "User",
        entityId: staff.id,
        details: { name: staff.name, email: staff.email },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      return NextResponse.json({ error: "This staff member has campaign notes and cannot be removed." }, { status: 409 });
    }
    console.error("Failed to remove staff account:", error);
    return NextResponse.json({ error: "Failed to remove staff account." }, { status: 500 });
  }
}