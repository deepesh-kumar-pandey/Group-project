import type { NormalizedRedditPost } from "@/lib/reddit/types";

export interface DiscussionAggregation {
  totalDiscussions: number;
  totalEngagement: number;
  avgScore: number;
  topTopics: string[];
  subredditBreakdown: Record<string, number>;
  timeRange: { earliest: Date | null; latest: Date | null };
}

export function aggregateDiscussions(
  posts: NormalizedRedditPost[]
): DiscussionAggregation {
  const subredditBreakdown: Record<string, number> = {};
  let totalEngagement = 0;
  let earliest: Date | null = null;
  let latest: Date | null = null;

  const wordFreq = new Map<string, number>();

  for (const post of posts) {
    subredditBreakdown[post.subreddit] =
      (subredditBreakdown[post.subreddit] ?? 0) + 1;
    totalEngagement += post.score + post.numComments;

    if (!earliest || post.postedAt < earliest) earliest = post.postedAt;
    if (!latest || post.postedAt > latest) latest = post.postedAt;

    const words = post.title.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    for (const word of words) {
      wordFreq.set(word, (wordFreq.get(word) ?? 0) + 1);
    }
  }

  const topTopics = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return {
    totalDiscussions: posts.length,
    totalEngagement,
    avgScore: posts.length > 0
      ? posts.reduce((s, p) => s + p.score, 0) / posts.length
      : 0,
    topTopics,
    subredditBreakdown,
    timeRange: { earliest, latest },
  };
}
