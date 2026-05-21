import { prisma } from "@/lib/prisma/client";
import type { Prisma, SummaryType } from "@prisma/client";

export async function upsertAiSummary(params: {
  companyId: string;
  type: SummaryType;
  title?: string;
  summary: string;
  pros?: string[];
  cons?: string[];
  highlights?: string[];
  metadata?: Prisma.InputJsonValue;
  model?: string;
  tokensUsed?: number;
}) {
  return prisma.aiSummary.upsert({
    where: {
      companyId_type: {
        companyId: params.companyId,
        type: params.type,
      },
    },
    create: {
      companyId: params.companyId,
      type: params.type,
      title: params.title,
      summary: params.summary,
      pros: params.pros ?? [],
      cons: params.cons ?? [],
      highlights: params.highlights ?? [],
      metadata: params.metadata,
      model: params.model ?? "gemini-2.0-flash",
      tokensUsed: params.tokensUsed,
    },
    update: {
      title: params.title,
      summary: params.summary,
      pros: params.pros ?? [],
      cons: params.cons ?? [],
      highlights: params.highlights ?? [],
      metadata: params.metadata,
      tokensUsed: params.tokensUsed,
    },
  });
}

export async function createSentimentScore(
  data: Prisma.SentimentScoreCreateInput
) {
  return prisma.sentimentScore.create({ data });
}

export async function upsertCompanyScore(
  companyId: string,
  scores: Omit<Prisma.CompanyScoreCreateInput, "company">
) {
  const latest = await prisma.companyScore.findFirst({
    where: { companyId },
    orderBy: { computedAt: "desc" },
  });

  if (
    latest &&
    Date.now() - latest.computedAt.getTime() < 1000 * 60 * 60
  ) {
    return prisma.companyScore.update({
      where: { id: latest.id },
      data: { ...scores, computedAt: new Date() },
    });
  }

  return prisma.companyScore.create({
    data: {
      company: { connect: { id: companyId } },
      ...scores,
    },
  });
}

export async function getLatestCompanyScore(companyId: string) {
  return prisma.companyScore.findFirst({
    where: { companyId },
    orderBy: { computedAt: "desc" },
  });
}
