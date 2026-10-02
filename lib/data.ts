import { CampaignRequest, Service } from "./type";

export const services: Service[] = [
  {
    id: "svc-youtube",
    slug: "youtube",
    name: "YouTube Campaigns",
    category: "Social & Content",
    shortDescription:
      "Reach real people through managed promotional campaigns built around your channel's goals.",
    helpsWith: [
      "Channel awareness",
      "Content discovery",
      "Audience growth",
      "Engagement campaigns",
      "Targeted promotion",
    ],
    tiers: [
      { name: "Awareness Campaign", description: "For getting your content in front of a relevant audience." },
      { name: "Growth Campaign", description: "For building sustained audience awareness and engagement." },
      { name: "Custom Campaign", description: "For campaigns with specific targeting or requirements." },
    ],
    active: true,
  },
  {
    id: "svc-instagram",
    slug: "instagram",
    name: "Instagram Campaigns",
    category: "Social & Content",
    shortDescription:
      "Build real reach across feed, reels, and stories with campaigns structured around a defined goal.",
    helpsWith: ["Profile discovery", "Reels distribution", "Follower growth", "Post engagement"],
    tiers: [
      { name: "Awareness Campaign", description: "Put your profile in front of a relevant, active audience." },
      { name: "Growth Campaign", description: "Sustained visibility across reels and stories over time." },
      { name: "Custom Campaign", description: "Tailored to a launch, collection, or specific targeting need." },
    ],
    active: true,
  },
  {
    id: "svc-tiktok",
    slug: "tiktok",
    name: "TikTok Campaigns",
    category: "Social & Content",
    shortDescription:
      "Get real viewers and real engagement behind the content that matters to your launch.",
    helpsWith: ["Video distribution", "Trend participation", "Audience growth", "Engagement campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "First push for a new account or a specific video." },
      { name: "Growth Campaign", description: "Ongoing audience building across a content calendar." },
      { name: "Custom Campaign", description: "Built around a launch moment or trend window." },
    ],
    active: true,
  },
  {
    id: "svc-x",
    slug: "x",
    name: "X Campaigns",
    category: "Social & Content",
    shortDescription:
      "Managed visibility campaigns for announcements, threads, and ongoing brand presence.",
    helpsWith: ["Announcement reach", "Thread distribution", "Follower growth", "Community engagement"],
    tiers: [
      { name: "Awareness Campaign", description: "Put a specific announcement in front of the right people." },
      { name: "Growth Campaign", description: "Build a consistent, engaged presence over time." },
      { name: "Custom Campaign", description: "Structured around a launch, AMA, or campaign window." },
    ],
    active: true,
  },
  {
    id: "svc-telegram",
    slug: "telegram",
    name: "Telegram Campaigns",
    category: "Social & Content",
    shortDescription:
      "Grow a real, active community around your channel or group.",
    helpsWith: ["Channel discovery", "Group growth", "Community activity", "Announcement reach"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your channel to a relevant audience." },
      { name: "Growth Campaign", description: "Build sustained community size and activity." },
      { name: "Custom Campaign", description: "For token launches, AMAs, or specific community goals." },
    ],
    active: true,
  },
  {
    id: "svc-spotify",
    slug: "spotify",
    name: "Spotify Campaigns",
    category: "Social & Content",
    shortDescription:
      "Managed promotion built around a release, not a stream count.",
    helpsWith: ["Release awareness", "Playlist discovery", "Listener growth", "Artist profile visibility"],
    tiers: [
      { name: "Awareness Campaign", description: "First push for a single or EP release." },
      { name: "Growth Campaign", description: "Sustained listener growth across a release cycle." },
      { name: "Custom Campaign", description: "Tailored to a tour, album, or label campaign." },
    ],
    active: true,
  },
  {
    id: "svc-community",
    slug: "community-growth",
    name: "Community Growth",
    category: "Web3 & Digital",
    shortDescription:
      "Grow and activate a real community around your product, protocol, or project.",
    helpsWith: ["Community onboarding", "Member activity", "Retention campaigns", "Discord & Telegram growth"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your project to a relevant early audience." },
      { name: "Growth Campaign", description: "Build and retain an active community over time." },
      { name: "Custom Campaign", description: "Structured around a launch, mint, or milestone." },
    ],
    active: true,
  },
  {
    id: "svc-web3",
    slug: "web3-campaigns",
    name: "Web3 Campaigns",
    category: "Web3 & Digital",
    shortDescription:
      "Managed campaigns for launches, mints, and protocol milestones that need real participation.",
    helpsWith: ["Launch awareness", "Mint participation", "Protocol adoption", "Testnet activity"],
    tiers: [
      { name: "Awareness Campaign", description: "Build pre-launch visibility with a relevant audience." },
      { name: "Growth Campaign", description: "Sustained participation across a campaign window." },
      { name: "Custom Campaign", description: "Built around your specific launch mechanics." },
    ],
    active: true,
  },
  {
    id: "svc-app",
    slug: "app-promotion",
    name: "App Promotion",
    category: "Web3 & Digital",
    shortDescription:
      "Get your app in front of real users who match your target profile.",
    helpsWith: ["Install campaigns", "App store visibility", "User onboarding", "Review campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your app to a relevant audience." },
      { name: "Growth Campaign", description: "Sustained install and engagement campaign." },
      { name: "Custom Campaign", description: "Tailored to a launch window or platform feature push." },
    ],
    active: true,
  },
  {
    id: "svc-product",
    slug: "product-promotion",
    name: "Product Promotion",
    category: "Web3 & Digital",
    shortDescription:
      "Managed campaigns for physical or digital products entering a new market.",
    helpsWith: ["Launch visibility", "Early adopter reach", "Review generation", "Market entry"],
    tiers: [
      { name: "Awareness Campaign", description: "First push into a new market or audience." },
      { name: "Growth Campaign", description: "Sustained visibility across a launch cycle." },
      { name: "Custom Campaign", description: "Structured around your specific launch plan." },
    ],
    active: true,
  },
  {
    id: "svc-event",
    slug: "event-attendance",
    name: "Event Attendance",
    category: "Real-World",
    shortDescription:
      "Fill the room with real attendees who match your event's audience.",
    helpsWith: ["Ticket sales support", "RSVP campaigns", "Local audience reach", "Turnout campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Build early visibility for your event." },
      { name: "Growth Campaign", description: "Sustained push toward your attendance target." },
      { name: "Custom Campaign", description: "Built around your venue, date, and audience." },
    ],
    active: true,
  },
  {
    id: "svc-local",
    slug: "local-business",
    name: "Local Business Campaigns",
    category: "Real-World",
    shortDescription:
      "Real-world campaigns that bring local customers through your door.",
    helpsWith: ["Foot traffic", "Local awareness", "Opening campaigns", "Repeat visit campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your business to the local area." },
      { name: "Growth Campaign", description: "Sustained local visibility over a campaign period." },
      { name: "Custom Campaign", description: "Built around an opening, sale, or seasonal push." },
    ],
    active: true,
  },
  {
    id: "svc-physical",
    slug: "physical-promotion",
    name: "Physical Promotion",
    category: "Real-World",
    shortDescription:
      "On-the-ground promotional campaigns for products, launches, and activations.",
    helpsWith: ["Sampling campaigns", "Street-level awareness", "Activation staffing", "Local distribution"],
    tiers: [
      { name: "Awareness Campaign", description: "First on-the-ground push for your launch." },
      { name: "Growth Campaign", description: "Sustained physical presence across a campaign." },
      { name: "Custom Campaign", description: "Built around your specific activation plan." },
    ],
    active: true,
  },
];

export const campaignRequests: CampaignRequest[] = [
  {
    id: "1",
    reference: "LG-000124",
    status: "NEW",
    companyName: "Acme Media",
    website: "acmemedia.io",
    industry: "Digital Media",
    contactPerson: "Ifeoma Chukwu",
    businessEmail: "ifeoma@acmemedia.io",
    telegram: "@ifeomac",
    preferredContactMethod: "Telegram",
    serviceId: "svc-youtube",
    campaignGoal: "Grow channel ahead of a product review series launch.",
    targetPlatform: "YouTube",
    targetCountry: "Nigeria",
    startDate: "2026-10-01",
    duration: "4 weeks",
    estimatedBudget: "$500",
    campaignUrl: "youtube.com/@acmemedia",
    additionalDetails: "Prefer audience aged 20-35, interested in tech.",
    notes: [],
    submittedAt: "2026-09-10T09:20:00Z",
  },
  {
    id: "2",
    reference: "LG-000123",
    status: "CONTACTED",
    companyName: "Nairawave",
    industry: "Fintech",
    contactPerson: "Tunde Bakare",
    businessEmail: "tunde@nairawave.co",
    phone: "+234 803 555 0192",
    preferredContactMethod: "Phone / WhatsApp",
    serviceId: "svc-telegram",
    campaignGoal: "Grow our Telegram community ahead of app launch.",
    targetPlatform: "Telegram",
    targetCountry: "Nigeria, Ghana",
    estimatedBudget: "$1,200",
    notes: [
      { id: "n1", author: "Amara", body: "Spoke with Tunde via WhatsApp, sending proposal Friday.", createdAt: "2026-09-09T14:00:00Z" },
    ],
    submittedAt: "2026-09-08T11:05:00Z",
  },
  {
    id: "3",
    reference: "LG-000122",
    status: "PLANNING",
    companyName: "Solace Collective",
    industry: "Web3 / DAO",
    contactPerson: "Kwame Owusu",
    businessEmail: "kwame@solace.xyz",
    telegram: "@kwameowusu",
    preferredContactMethod: "Telegram",
    serviceId: "svc-web3",
    campaignGoal: "Drive testnet participation for our upcoming mainnet launch.",
    targetPlatform: "Discord, Telegram",
    targetCountry: "Global",
    estimatedBudget: "$3,000",
    notes: [
      { id: "n2", author: "Segun", body: "Client wants global reach with weighting toward SEA.", createdAt: "2026-09-05T10:00:00Z" },
      { id: "n3", author: "Segun", body: "Proposed $2,750 campaign, awaiting confirmation.", createdAt: "2026-09-07T16:30:00Z" },
    ],
    submittedAt: "2026-09-03T08:40:00Z",
  },
  {
    id: "4",
    reference: "LG-000118",
    status: "LIVE",
    companyName: "Lagos Nights Fest",
    industry: "Events",
    contactPerson: "Bisi Adeyemi",
    businessEmail: "bisi@lagosnights.com",
    preferredContactMethod: "Email",
    serviceId: "svc-event",
    campaignGoal: "Fill 2,000-capacity venue for October festival.",
    targetPlatform: "Instagram, Local",
    targetCountry: "Nigeria",
    estimatedBudget: "$4,500",
    notes: [],
    submittedAt: "2026-08-20T13:15:00Z",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServiceById(id: string) {
  return services.find((s) => s.id === id);
}

export const statusLabels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  PLANNING: "Planning",
  PENDING: "Pending",
  ARCHIVED: "Archived",
  OFFER_SENT: "Offer sent",
  APPROVED: "Approved",
  PAYMENT_PENDING: "Payment pending",
  PAID: "Paid",
  CAMPAIGN_PREPARATION: "Campaign preparation",
  LIVE: "Live",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const statusOrder = [
  "NEW",
  "CONTACTED",
  "PLANNING",
  "OFFER_SENT",
  "APPROVED",
  "PAYMENT_PENDING",
  "PAID",
  "CAMPAIGN_PREPARATION",
  "LIVE",
  "COMPLETED",
];