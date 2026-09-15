import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const contactMethodMap: Record<string, "EMAIL" | "TELEGRAM" | "WHATSAPP" | "PHONE"> = {
  EMAIL: "EMAIL",
  TELEGRAM: "TELEGRAM",
  WHATSAPP: "WHATSAPP",
  PHONE: "PHONE",
};

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,|\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTargetPlatforms(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,|\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const required = [
      "companyName",
      "industry",
      "contactPersonName",
      "businessEmail",
      "preferredContactMethod",
      "serviceSlug",
      "campaignGoal",
      "targetPlatforms",
    ];

    for (const field of required) {
      if (!body[field] || (Array.isArray(body[field]) && body[field].length === 0)) {
        return NextResponse.json({ error: `Missing ${field}` }, { status: 400 });
      }
    }

    const service = await prisma.service.findFirst({
      where: { slug: body.serviceSlug, active: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Selected service is invalid" }, { status: 400 });
    }

    const dbService = service;

    const preferredContactMethod = contactMethodMap[body.preferredContactMethod];

    if (!preferredContactMethod) {
      return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
    }

    const targetPlatforms = normalizeTargetPlatforms(body.targetPlatforms);

    if (!targetPlatforms.length) {
      return NextResponse.json({ error: "Missing targetPlatforms" }, { status: 400 });
    }

    const reference = buildReference();

    const campaign = await prisma.campaign.create({
      data: {
        reference,
        status: "NEW",
        companyName: String(body.companyName).trim(),
        website: body.website ? String(body.website).trim() : null,
        industry: String(body.industry).trim(),
        contactPersonName: String(body.contactPersonName).trim(),
        businessEmail: String(body.businessEmail).trim().toLowerCase(),
        telegramHandle: body.telegramHandle ? String(body.telegramHandle).trim() : null,
        phoneNumber: body.phoneNumber ? String(body.phoneNumber).trim() : null,
        preferredContactMethod,
        serviceId: dbService.id,
        campaignGoal: String(body.campaignGoal).trim(),
        targetPlatforms,
        targetCountry: body.targetCountry ? String(body.targetCountry).trim() : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        duration: body.duration ? String(body.duration).trim() : null,
        estimatedBudget: body.estimatedBudget ? String(body.estimatedBudget).trim() : null,
        campaignUrl: body.campaignUrl ? String(body.campaignUrl).trim() : null,
        additionalNotes: body.additionalNotes ? String(body.additionalNotes).trim() : null,
        supportingLinks: normalizeStringArray(body.supportingLinks),
      },
    });

    return NextResponse.json({ success: true, campaignId: campaign.id, reference }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save campaign request" }, { status: 500 });
  }
}

function buildReference() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = randomUUID().slice(0, 4).toUpperCase();
  return `LG-${year}${month}-${random}`;
}
