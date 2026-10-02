import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appendAuditLog, auditSnapshot } from "@/lib/audit";
import { randomUUID } from "node:crypto";
import { EmailTemplate } from '../../../components/template/contact-template';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateLookup = new Map<string, { count: number; windowStartedAt: number }>();

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "local";
  return ip || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLookup.get(key);

  if (!entry || now - entry.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    rateLookup.set(key, { count: 1, windowStartedAt: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  const key = getClientKey(request);
  const body = await request.json();

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many service requests. Try again shortly." },
      { status: 429 }
    );
  }
  try {
    // trackingId must also have a @unique constraint in the Prisma schema.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const trackingId = `contact_${randomUUID()}`;

      try {
        const contact = await prisma.$transaction(async (transaction) => {
          const created = await transaction.contact.create({
            data: {
            name: body.name,
            email: body.email,
            message: body.message,
            companyName: body.company,
            status: "PENDING",
            trackingId,
            },
          });
          await appendAuditLog(transaction, {
            actor: { label: "Public contact request" },
            action: "CREATE",
            entityType: "Contact",
            entityId: created.id,
            details: { snapshot: auditSnapshot(created) },
          });
          return created;
        });

        const { data, error } = await resend.emails.send({
      from: 'No reply <no-reply@jbcapi.com>',
      to: [body.email],
      subject: 'Your Contact Request has been recieved',
      react: EmailTemplate({ firstName: body.name, trackingId: contact.trackingId }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

        return NextResponse.json({ contact }, { status: 201 });
      } catch (error) {
        if ((error as { code?: string }).code !== "P2002" || attempt === 2) {
          throw error;
        }
      }
    }

    throw new Error("Unable to generate a unique tracking ID");
  } catch (error) {
    console.error("contact route failed", error);
    return NextResponse.json({ error: "Unable to submit contact request" }, { status: 500 });
  }
}


