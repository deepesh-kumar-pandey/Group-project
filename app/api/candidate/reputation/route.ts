import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { candidateReputationSchema } from "@/lib/validation/candidate";
import { getCandidateReputation } from "@/lib/services/candidate";
import { ApiError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { candidateId } = candidateReputationSchema.parse(params);

  const reputation = await getCandidateReputation(candidateId);
  if (!reputation) {
    throw ApiError.notFound(`Candidate not found: ${candidateId}`);
  }

  return jsonSuccess({ reputation });
});
