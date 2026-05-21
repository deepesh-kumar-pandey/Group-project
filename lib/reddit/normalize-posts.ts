import type { RedditPost, NormalizedRedditPost } from "./types";

export function normalizeRedditPost(post: RedditPost): NormalizedRedditPost {
  const permalink = post.permalink.startsWith("http")
    ? post.permalink
    : `https://www.reddit.com${post.permalink}`;

  return {
    redditId: post.id,
    title: post.title,
    content: post.selftext?.trim() || null,
    author: post.author === "[deleted]" ? null : post.author,
    subreddit: post.subreddit,
    url: post.url,
    permalink,
    score: post.score,
    numComments: post.num_comments,
    upvoteRatio: post.upvote_ratio ?? null,
    isSelf: post.is_self,
    flair: post.link_flair_text ?? null,
    postedAt: new Date(post.created_utc * 1000),
    rawData: post as unknown as Record<string, unknown>,
  };
}

export function normalizeRedditPosts(posts: RedditPost[]): NormalizedRedditPost[] {
  return posts.map(normalizeRedditPost);
}
