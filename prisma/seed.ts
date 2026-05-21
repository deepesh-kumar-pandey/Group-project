import { PrismaClient, SummaryType, SentimentLabel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const companies = [
    {
      name: "Tesla",
      slug: "tesla",
      industry: "Automotive",
      headquarters: "Austin, Texas",
      country: "United States",
      city: "Austin",
      website: "https://www.tesla.com",
    },
    {
      name: "Google",
      slug: "google",
      industry: "Technology",
      headquarters: "Mountain View, California",
      country: "United States",
      city: "Mountain View",
      website: "https://www.google.com",
    },
    {
      name: "Amazon",
      slug: "amazon",
      industry: "E-commerce",
      headquarters: "Seattle, Washington",
      country: "United States",
      city: "Seattle",
      website: "https://www.amazon.com",
    },
    {
      name: "Microsoft",
      slug: "microsoft",
      industry: "Technology",
      headquarters: "Redmond, Washington",
      country: "United States",
      city: "Redmond",
      website: "https://www.microsoft.com",
    },
    {
      name: "Meta",
      slug: "meta",
      industry: "Technology",
      headquarters: "Menlo Park, California",
      country: "United States",
      city: "Menlo Park",
      website: "https://www.meta.com",
    },
  ];

  for (const company of companies) {
    const created = await prisma.company.upsert({
      where: { slug: company.slug },
      create: company,
      update: company,
    });

    await prisma.companyScore.create({
      data: {
        companyId: created.id,
        reputationScore: 3.5 + Math.random() * 1.5,
        cultureScore: 3 + Math.random() * 2,
        hiringScore: 3 + Math.random() * 2,
        compensationScore: 3.5 + Math.random() * 1.5,
        workLifeScore: 2.5 + Math.random() * 2,
        leadershipScore: 3 + Math.random() * 2,
        toxicityScore: Math.random() * 3,
        engineeringScore: 3.5 + Math.random() * 1.5,
        growthScore: 3 + Math.random() * 2,
        confidence: 0.7,
        factors: { source: "seed" },
      },
    });

    await prisma.sentimentScore.create({
      data: {
        companyId: created.id,
        overallScore: 0.2 + Math.random() * 0.5,
        label: SentimentLabel.POSITIVE,
        positiveRatio: 0.4 + Math.random() * 0.3,
        negativeRatio: 0.1 + Math.random() * 0.2,
        neutralRatio: 0.2 + Math.random() * 0.2,
        sampleSize: Math.floor(50 + Math.random() * 200),
        hiringScore: 0.3 + Math.random() * 0.4,
        cultureScore: 0.3 + Math.random() * 0.4,
        managementScore: 0.2 + Math.random() * 0.5,
        compensationScore: 0.3 + Math.random() * 0.4,
      },
    });

    await prisma.aiSummary.upsert({
      where: {
        companyId_type: {
          companyId: created.id,
          type: SummaryType.COMPANY_OVERVIEW,
        },
      },
      create: {
        companyId: created.id,
        type: SummaryType.COMPANY_OVERVIEW,
        title: `${company.name} Overview`,
        summary: `${company.name} is a major player in the ${company.industry} industry, headquartered in ${company.headquarters}.`,
        pros: ["Strong brand recognition", "Competitive compensation", "Innovation focus"],
        cons: ["High workload reported", "Fast-paced environment"],
        highlights: ["Industry leader", "Global presence"],
      },
      update: {},
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
