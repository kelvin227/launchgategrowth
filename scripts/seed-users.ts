import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users: Array<{
  email: string;
  name: string;
  password: string;
  role: UserRole;
}> = [
  {
    email: "admin@launchgate.com",
    name: "LaunchGate Admin",
    password: "LaunchGateAdmin2026!",
    role: "ADMIN",
  },
  {
    email: "staff.one@launchgate.com",
    name: "Campaign Manager",
    password: "LaunchGateStaff2026!",
    role: "STAFF",
  },
  {
    email: "staff.two@launchgate.com",
    name: "Growth Strategist",
    password: "LaunchGateStaff2026!",
    role: "STAFF",
  },
  {
    email: "staff.three@launchgate.com",
    name: "Operations Coordinator",
    password: "LaunchGateStaff2026!",
    role: "STAFF",
  },
  {
    email: "advertiser.one@example.com",
    name: "Advertiser One",
    password: "LaunchGateAdvertiser2026!",
    role: "ADVERTISER",
  },
  {
    email: "advertiser.two@example.com",
    name: "Advertiser Two",
    password: "LaunchGateAdvertiser2026!",
    role: "ADVERTISER",
  },
];

async function main() {
  for (const user of users) {
    const password = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        password,
        role: user.role,
      },
    });
  }

  console.log(`Seeded ${users.length} users`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });