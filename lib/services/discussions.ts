import { aggregateRedditDiscussions } from "@/lib/reddit/aggregate";
import { upsertRedditPost } from "@/lib/prisma/queries/reddit";
import { parseSentimentFromText } from "@/lib/reddit/sentiment-parser";

export async function fetchAndPersistDiscussions(params: {
  companyId: string;
  companyName: string;
  companySlug: string;
  limit?: number;
}) {
  const aggregation = await aggregateRedditDiscussions({
    query: params.companyName,
    companySlug: params.companySlug,
    limit: params.limit ?? 50,
  });

  for (const post of aggregation.posts) {
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
      rawData: post.rawData,
      company: { connect: { id: params.companyId } },
    });
  }

  return aggregation;
}

export function extractDiscussionTexts(
  posts: { title: string; content: string | null }[]
): string[] {
  return posts.map((p) => `${p.title}\n${p.content ?? ""}`.trim()).filter(Boolean);
}
