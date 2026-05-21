import { prisma } from "@/lib/prisma/client";
import type { Prisma } from "@prisma/client";

export async function findCandidateById(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: { profiles: { orderBy: { updatedAt: "desc" }, take: 1 } },
  });
}

export async function createCandidate(data: Prisma.CandidateCreateInput) {
  return prisma.candidate.create({ data });
}

export async function upsertCandidateProfile(
  candidateId: string,
  data: Omit<Prisma.CandidateProfileCreateInput, "candidate">
) {
  const existing = await prisma.candidateProfile.findFirst({
    where: { candidateId },
    orderBy: { updatedAt: "desc" },
  });

  if (existing) {
    return prisma.candidateProfile.update({
      where: { id: existing.id },
      data: {
        ...data,
        analyzedAt: new Date(),
      },
    });
  }

  return prisma.candidateProfile.create({
    data: {
      candidate: { connect: { id: candidateId } },
      ...data,
      analyzedAt: new Date(),
    },
  });
}
