export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  url: string;
  permalink: string;
  score: number;
  num_comments: number;
  upvote_ratio?: number;
  is_self: boolean;
  link_flair_text?: string | null;
  created_utc: number;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
}

export interface RedditListingChild<T> {
  kind: string;
  data: T;
}

export interface RedditListing<T> {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    children: RedditListingChild<T>[];
  };
}

export interface RedditSearchResponse {
  kind: string;
  data: RedditListing<RedditPost>["data"];
}

export interface NormalizedRedditPost {
  redditId: string;
  title: string;
  content: string | null;
  author: string | null;
  subreddit: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  upvoteRatio: number | null;
  isSelf: boolean;
  flair: string | null;
  postedAt: Date;
  rawData?: Record<string, unknown>;
}
