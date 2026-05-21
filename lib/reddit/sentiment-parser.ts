import type { SentimentLabel } from "@prisma/client";

export interface ParsedSentiment {
  label: SentimentLabel;
  score: number;
}

const POSITIVE_WORDS = new Set([
  "great", "good", "excellent", "amazing", "love", "best", "happy",
  "positive", "recommend", "awesome", "fantastic", "wonderful", "supportive",
  "fair", "growth", "benefits", "flexible", "innovative", "collaborative",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "hate", "worst", "toxic", "horrible",
  "negative", "avoid", "toxicity", "burnout", "overwork", "underpaid",
  "micromanage", "layoff", "hostile", "discrimination", "unfair", "stress",
]);

export function parseSentimentFromText(text: string): ParsedSentiment {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let positive = 0;
  let negative = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) positive++;
    if (NEGATIVE_WORDS.has(word)) negative++;
  }

  const total = positive + negative;
  if (total === 0) {
    return { label: "NEUTRAL", score: 0 };
  }

  const score = (positive - negative) / total;

  if (score >= 0.5) return { label: "VERY_POSITIVE", score };
  if (score >= 0.15) return { label: "POSITIVE", score };
  if (score <= -0.5) return { label: "VERY_NEGATIVE", score };
  if (score <= -0.15) return { label: "NEGATIVE", score };
  return { label: "NEUTRAL", score };
}

export function aggregateSentiment(
  texts: string[]
): { label: SentimentLabel; score: number; distribution: Record<string, number> } {
  const distribution: Record<string, number> = {
    VERY_NEGATIVE: 0,
    NEGATIVE: 0,
    NEUTRAL: 0,
    POSITIVE: 0,
    VERY_POSITIVE: 0,
  };

  let totalScore = 0;

  for (const text of texts) {
    const parsed = parseSentimentFromText(text);
    distribution[parsed.label]++;
    totalScore += parsed.score;
  }

  const avgScore = texts.length > 0 ? totalScore / texts.length : 0;
  const dominant = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "NEUTRAL";

  return {
    label: dominant as SentimentLabel,
    score: avgScore,
    distribution,
  };
}
