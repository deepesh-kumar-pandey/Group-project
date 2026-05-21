import { z } from "zod";

export const candidateAnalyzeSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  skills: z.array(z.string()).max(50).optional(),
  bio: z.string().max(5000).optional(),
  targetCompanySlug: z.string().optional(),
});

export const candidateGithubSchema = z.object({
  username: z.string().min(1).max(100),
});

export const candidateReputationSchema = z.object({
  candidateId: z.string().uuid(),
});

export type CandidateAnalyzeInput = z.infer<typeof candidateAnalyzeSchema>;
