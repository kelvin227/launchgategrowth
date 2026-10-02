export type ServiceCategory =
  | "Social & Content"
  | "Web3 & Digital"
  | "Real-World";

export type CampaignTier = {
  name: string;
  description: string;
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  helpsWith: string[];
  tiers: CampaignTier[];
  active: boolean;
};

export type CampaignStatus =
  | "NEW"
  | "CONTACTED"
  | "PLANNING"
  | "OFFER_SENT"
  | "APPROVED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "CAMPAIGN_PREPARATION"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type ContactStatus =
  | "PENDING"
  | "CONTACTED"
  | "ARCHIVED";

export type CampaignNote = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type CampaignRequest = {
  id: string;
  reference: string;
  status: CampaignStatus;
  companyName: string;
  website?: string;
  industry: string;
  contactPerson: string;
  businessEmail: string;
  telegram?: string;
  phone?: string;
  preferredContactMethod: "Email" | "Telegram" | "Phone / WhatsApp";
  serviceId: string;
  campaignGoal: string;
  targetPlatform: string;
  targetCountry?: string;
  startDate?: string;
  duration?: string;
  estimatedBudget?: string;
  campaignUrl?: string;
  additionalDetails?: string;
  notes: CampaignNote[];
  submittedAt: string;
};