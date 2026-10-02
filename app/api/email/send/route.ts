import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkMutationRateLimit } from "@/lib/service-management";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "You are not authorized to send email." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const to = typeof body?.to === "string" ? body.to.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) ||
    to.length > 254 ||
    !subject || subject.length > 180 ||
    !message || message.length > 10_000
  ) {
    return NextResponse.json(
      { error: "Enter a valid recipient, a subject up to 180 characters, and a message up to 10,000 characters." },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  let limit;
  try {
    limit = await checkMutationRateLimit(`email:${session.user.id}`, 5, 10 * 60 * 1000);
  } catch (error) {
    console.error("Email rate limit check failed:", error);
    return NextResponse.json({ error: "Unable to verify email sending limits right now." }, { status: 503 });
  }
  if (limit.limited) {
    return NextResponse.json(
      { error: "Email limit reached. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const escapedMessage = escapeHtml(message);
  const html = `<div style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.6;">${escapedMessage}</div>`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "No reply <no-reply@jbcapi.com>",
      to: [to],
      subject,
      text: message,
      html,
      ...(session.user.email ? { replyTo: session.user.email } : {}),
    });

    if (error) {
      console.error("Resend email delivery failed:", error);
      return NextResponse.json({ error: "Email could not be delivered. Check the recipient and try again." }, { status: 502 });
    }

    let auditRecorded = true;
    try {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          actorLabel: `${session.user.name || session.user.email || session.user.id} (${session.user.role})`,
          action: "SEND",
          entityType: "Email",
          entityId: data?.id ?? null,
          details: { recipient: to, subject },
        },
      });
    } catch (auditError) {
      auditRecorded = false;
      console.error("Email sent but activity logging failed:", auditError);
    }

    return NextResponse.json({ success: true, id: data?.id ?? null, auditRecorded });
  } catch (error) {
    console.error("Email send route failed:", error);
    return NextResponse.json({ error: "Email could not be delivered." }, { status: 502 });
  }
}