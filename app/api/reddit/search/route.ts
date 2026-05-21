import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { redditSearchSchema } from "@/lib/validation/reddit";
import { searchReddit } from "@/lib/reddit/search-reddit";
import { findCompanyBySlug } from "@/lib/prisma/queries/companies";
import { upsertRedditPost } from "@/lib/prisma/queries/reddit";
import { parseSentimentFromText } from "@/lib/reddit/sentiment-parser";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const input = redditSearchSchema.parse(params);

  const result = await searchReddit({
    query: input.q,
    subreddit: input.subreddit,
    sort: input.sort,
    time: input.time,
    limit: input.limit,
    after: input.after,
  });

  if (input.persist && input.companySlug) {
    const company = await findCompanyBySlug(input.companySlug);
    if (company) {
      for (const post of result.posts) {
        const text = `${post.title} ${post.content ?? ""}`;
        const sentiment = parseSentimentFromText(text);
        await upsertRedditPost({
          redditId: post.redditId,
          title: post.title,
          content: post.content,
          author: post.author,
          subreddit: post.subreddit,
          url: post.url,
          permalink: post.permalink,
          score: post.score,
          numComments: post.numComments,
          upvoteRatio: post.upvoteRatio,
          isSelf: post.isSelf,
          flair: post.flair,
          sentiment: sentiment.label,
          sentimentScore: sentiment.score,
          postedAt: post.postedAt,
          company: { connect: { id: company.id } },
        });
      }
    }
  }

  return jsonSuccess({
    posts: result.posts,
    after: result.after,
    total: result.total,
  });
});
