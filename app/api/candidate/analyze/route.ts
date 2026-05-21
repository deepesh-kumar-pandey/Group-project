import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { candidateAnalyzeSchema } from "@/lib/validation/candidate";
import { analyzeCandidateProfile, fetchGithubStats } from "@/lib/services/candidate";
import { requireDbUser } from "@/lib/supabase/auth";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const dbUser = await requireDbUser();
  const body = await request.json();
  const input = candidateAnalyzeSchema.parse(body);

  let githubStats = null;
  if (input.githubUrl) {
    const match = input.githubUrl.match(/github\.com\/([^/]+)/);
    if (match?.[1]) {
      githubStats = await fetchGithubStats(match[1]);
    }
  }

  const result = await analyzeCandidateProfile({
    ...input,
    userId: dbUser.id,
  });

  return jsonSuccess({
    ...result,
    githubStats,
  });
});
