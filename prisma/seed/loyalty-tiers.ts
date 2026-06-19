import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding loyalty tiers...");

  const tiers = [
    {
      name: "Bronze",
      minPoints: 0,
      perksDescription:
        "Earn 1 point per £1 spent. Standard delivery rates apply.",
    },
    {
      name: "Silver",
      minPoints: 500,
      perksDescription:
        "Earn 1.25 points per £1 spent. Free UK delivery on orders over £75. Early access to selected drops.",
    },
    {
      name: "Gold",
      minPoints: 1500,
      perksDescription:
        "Earn 1.5 points per £1 spent. Free UK delivery on all orders. Priority offer review. Early access to all drops. Exclusive member-only drops.",
    },
  ];

  for (const tier of tiers) {
    const result = await prisma.loyaltyTier.upsert({
      where: { name: tier.name },
      update: {
        minPoints: tier.minPoints,
        perksDescription: tier.perksDescription,
      },
      create: tier,
    });
    console.log(`  ${result.name}: ${result.minPoints}+ points`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
