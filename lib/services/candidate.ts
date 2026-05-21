import { z } from "zod";
import { generateContent } from "@/lib/ai/client";
import { buildCandidatePrompt } from "@/lib/ai/prompts";
import { parseAiJson } from "@/lib/ai/parser";
import {
  createCandidate,
  upsertCandidateProfile,
  findCandidateById,
} from "@/lib/prisma/queries/candidates";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

const candidateAnalysisSchema = z.object({
  headline: z.string(),
  reputationScore: z.number(),
  skills: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  cultureFit: z.array(z.string()),
  summary: z.string(),
});

export async function analyzeCandidateProfile(params: {
  name: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: string[];
  bio?: string;
  userId?: string;
}) {
  const profileText = [
    `Name: ${params.name}`,
    params.email ? `Email: ${params.email}` : "",
    params.githubUrl ? `GitHub: ${params.githubUrl}` : "",
    params.linkedinUrl ? `LinkedIn: ${params.linkedinUrl}` : "",
    params.skills?.length ? `Skills: ${params.skills.join(", ")}` : "",
    params.bio ? `Bio: ${params.bio}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = buildCandidatePrompt(profileText);
  const response = await generateContent(prompt);
  const analysis = parseAiJson(response, candidateAnalysisSchema);

  const candidate = await createCandidate({
    name: params.name,
    email: params.email,
    githubUrl: params.githubUrl,
    linkedinUrl: params.linkedinUrl,
    ...(params.userId ? { user: { connect: { id: params.userId } } } : {}),
  });

  const profile = await upsertCandidateProfile(candidate.id, {
    headline: analysis.headline,
    bio: params.bio,
    skills: analysis.skills,
    reputationScore: analysis.reputationScore,
    analysis: analysis as unknown as Record<string, unknown>,
  });

  return { candidate, profile, analysis };
}

export async function getCandidateReputation(candidateId: string) {
  return cacheGetOrSet(
    CacheKeys.candidateReputation(candidateId),
    CacheTTL.MEDIUM,
    async () => {
      const candidate = await findCandidateById(candidateId);
      if (!candidate) return null;

      const profile = candidate.profiles[0];
      return {
        candidateId: candidate.id,
        name: candidate.name,
        reputationScore: profile?.reputationScore ?? null,
        analysis: profile?.analysis ?? null,
        skills: profile?.skills ?? [],
        analyzedAt: profile?.analyzedAt ?? null,
      };
    }
  );
}

export async function fetchGithubStats(username: string) {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    login: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    html_url: string;
  };

  return {
    username: data.login,
    name: data.name,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    memberSince: data.created_at,
    profileUrl: data.html_url,
  };
}
