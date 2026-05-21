import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { redditNormalizeSchema } from "@/lib/validation/reddit";
import { normalizeRedditPost } from "@/lib/reddit/normalize-posts";
import type { RedditPost } from "@/lib/reddit/types";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { posts } = redditNormalizeSchema.parse(body);

  const normalized = (posts as RedditPost[]).map(normalizeRedditPost);

  return jsonSuccess({ posts: normalized, count: normalized.length });
});
