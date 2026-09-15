import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    id: "svc-youtube",
    slug: "youtube",
    name: "YouTube Campaigns",
    category: "Social & Content",
    description:
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
    icon: "youtube",
    sortOrder: 1,
  },
  {
    id: "svc-instagram",
    slug: "instagram",
    name: "Instagram Campaigns",
    category: "Social & Content",
    description:
      "Build real reach across feed, reels, and stories with campaigns structured around a defined goal.",
    helpsWith: ["Profile discovery", "Reels distribution", "Follower growth", "Post engagement"],
    tiers: [
      { name: "Awareness Campaign", description: "Put your profile in front of a relevant, active audience." },
      { name: "Growth Campaign", description: "Sustained visibility across reels and stories over time." },
      { name: "Custom Campaign", description: "Tailored to a launch, collection, or specific targeting need." },
    ],
    active: true,
    icon: "instagram",
    sortOrder: 2,
  },
  {
    id: "svc-tiktok",
    slug: "tiktok",
    name: "TikTok Campaigns",
    category: "Social & Content",
    description:
      "Get real viewers and real engagement behind the content that matters to your launch.",
    helpsWith: ["Video distribution", "Trend participation", "Audience growth", "Engagement campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "First push for a new account or a specific video." },
      { name: "Growth Campaign", description: "Ongoing audience building across a content calendar." },
      { name: "Custom Campaign", description: "Built around a launch moment or trend window." },
    ],
    active: true,
    icon: "tiktok",
    sortOrder: 3,
  },
  {
    id: "svc-x",
    slug: "x",
    name: "X Campaigns",
    category: "Social & Content",
    description:
      "Managed visibility campaigns for announcements, threads, and ongoing brand presence.",
    helpsWith: ["Announcement reach", "Thread distribution", "Follower growth", "Community engagement"],
    tiers: [
      { name: "Awareness Campaign", description: "Put a specific announcement in front of the right people." },
      { name: "Growth Campaign", description: "Build a consistent, engaged presence over time." },
      { name: "Custom Campaign", description: "Structured around a launch, AMA, or campaign window." },
    ],
    active: true,
    icon: "x",
    sortOrder: 4,
  },
  {
    id: "svc-telegram",
    slug: "telegram",
    name: "Telegram Campaigns",
    category: "Social & Content",
    description:
      "Grow a real, active community around your channel or group.",
    helpsWith: ["Channel discovery", "Group growth", "Community activity", "Announcement reach"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your channel to a relevant audience." },
      { name: "Growth Campaign", description: "Build sustained community size and activity." },
      { name: "Custom Campaign", description: "For token launches, AMAs, or specific community goals." },
    ],
    active: true,
    icon: "telegram",
    sortOrder: 5,
  },
  {
    id: "svc-spotify",
    slug: "spotify",
    name: "Spotify Campaigns",
    category: "Social & Content",
    description:
      "Managed promotion built around a release, not a stream count.",
    helpsWith: ["Release awareness", "Playlist discovery", "Listener growth", "Artist profile visibility"],
    tiers: [
      { name: "Awareness Campaign", description: "First push for a single or EP release." },
      { name: "Growth Campaign", description: "Sustained listener growth across a release cycle." },
      { name: "Custom Campaign", description: "Tailored to a tour, album, or label campaign." },
    ],
    active: true,
    icon: "spotify",
    sortOrder: 6,
  },
  {
    id: "svc-community",
    slug: "community-growth",
    name: "Community Growth",
    category: "Web3 & Digital",
    description:
      "Grow and activate a real community around your product, protocol, or project.",
    helpsWith: ["Community onboarding", "Member activity", "Retention campaigns", "Discord & Telegram growth"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your project to a relevant early audience." },
      { name: "Growth Campaign", description: "Build and retain an active community over time." },
      { name: "Custom Campaign", description: "Structured around a launch, mint, or milestone." },
    ],
    active: true,
    icon: "community-growth",
    sortOrder: 7,
  },
  {
    id: "svc-web3",
    slug: "web3-campaigns",
    name: "Web3 Campaigns",
    category: "Web3 & Digital",
    description:
      "Managed campaigns for launches, mints, and protocol milestones that need real participation.",
    helpsWith: ["Launch awareness", "Mint participation", "Protocol adoption", "Testnet activity"],
    tiers: [
      { name: "Awareness Campaign", description: "Build pre-launch visibility with a relevant audience." },
      { name: "Growth Campaign", description: "Sustained participation across a campaign window." },
      { name: "Custom Campaign", description: "Built around your specific launch mechanics." },
    ],
    active: true,
    icon: "web3-campaigns",
    sortOrder: 8,
  },
  {
    id: "svc-app",
    slug: "app-promotion",
    name: "App Promotion",
    category: "Web3 & Digital",
    description:
      "Get your app in front of real users who match your target profile.",
    helpsWith: ["Install campaigns", "App store visibility", "User onboarding", "Review campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your app to a relevant audience." },
      { name: "Growth Campaign", description: "Sustained install and engagement campaign." },
      { name: "Custom Campaign", description: "Tailored to a launch window or platform feature push." },
    ],
    active: true,
    icon: "app-promotion",
    sortOrder: 9,
  },
  {
    id: "svc-product",
    slug: "product-promotion",
    name: "Product Promotion",
    category: "Web3 & Digital",
    description:
      "Managed campaigns for physical or digital products entering a new market.",
    helpsWith: ["Launch visibility", "Early adopter reach", "Review generation", "Market entry"],
    tiers: [
      { name: "Awareness Campaign", description: "First push into a new market or audience." },
      { name: "Growth Campaign", description: "Sustained visibility across a launch cycle." },
      { name: "Custom Campaign", description: "Structured around your specific launch plan." },
    ],
    active: true,
    icon: "product-promotion",
    sortOrder: 10,
  },
  {
    id: "svc-event",
    slug: "event-attendance",
    name: "Event Attendance",
    category: "Real-World",
    description:
      "Fill the room with real attendees who match your event's audience.",
    helpsWith: ["Ticket sales support", "RSVP campaigns", "Local audience reach", "Turnout campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Build early visibility for your event." },
      { name: "Growth Campaign", description: "Sustained push toward your attendance target." },
      { name: "Custom Campaign", description: "Built around your venue, date, and audience." },
    ],
    active: true,
    icon: "event-attendance",
    sortOrder: 11,
  },
  {
    id: "svc-local",
    slug: "local-business",
    name: "Local Business Campaigns",
    category: "Real-World",
    description:
      "Real-world campaigns that bring local customers through your door.",
    helpsWith: ["Foot traffic", "Local awareness", "Opening campaigns", "Repeat visit campaigns"],
    tiers: [
      { name: "Awareness Campaign", description: "Introduce your business to the local area." },
      { name: "Growth Campaign", description: "Sustained local visibility over a campaign period." },
      { name: "Custom Campaign", description: "Built around an opening, sale, or seasonal push." },
    ],
    active: true,
    icon: "local-business",
    sortOrder: 12,
  },
  {
    id: "svc-physical",
    slug: "physical-promotion",
    name: "Physical Promotion",
    category: "Real-World",
    description:
      "On-the-ground promotional campaigns for products, launches, and activations.",
    helpsWith: ["Sampling campaigns", "Street-level awareness", "Activation staffing", "Local distribution"],
    tiers: [
      { name: "Awareness Campaign", description: "First on-the-ground push for your launch." },
      { name: "Growth Campaign", description: "Sustained physical presence across a campaign." },
      { name: "Custom Campaign", description: "Built around your specific activation plan." },
    ],
    active: true,
    icon: "physical-promotion",
    sortOrder: 13,
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`Seeded ${services.length} services`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
