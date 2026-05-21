import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { candidateGithubSchema } from "@/lib/validation/candidate";
import { fetchGithubStats } from "@/lib/services/candidate";
import { ApiError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { username } = candidateGithubSchema.parse(params);

  const stats = await fetchGithubStats(username);
  if (!stats) {
    throw ApiError.notFound(`GitHub user not found: ${username}`);
  }

  return jsonSuccess({ stats });
});
