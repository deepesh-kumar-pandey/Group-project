export function buildSummaryPrompt(companyName: string, discussions: string): string {
  return `You are a workplace intelligence analyst. Analyze discussions about "${companyName}" and return ONLY valid JSON with this exact structure:
{
  "title": "string",
  "summary": "string (2-3 paragraphs)",
  "pros": ["string"],
  "cons": ["string"],
  "highlights": ["string"],
  "confidence": 0.0-1.0
}

Discussions:
${discussions}

Focus on: workplace culture, compensation, management, work-life balance, career growth, and hiring experiences.`;
}

export function buildSentimentPrompt(companyName: string, texts: string): string {
  return `Analyze sentiment for "${companyName}" from these texts. Return ONLY valid JSON:
{
  "overallScore": -1.0 to 1.0,
  "label": "VERY_NEGATIVE|NEGATIVE|NEUTRAL|POSITIVE|VERY_POSITIVE",
  "positiveRatio": 0.0-1.0,
  "negativeRatio": 0.0-1.0,
  "neutralRatio": 0.0-1.0,
  "themes": ["string"],
  "sampleSize": number
}

Texts:
${texts}`;
}

export function buildReputationPrompt(companyName: string, discussions: string): string {
  return `Score "${companyName}" reputation from discussions. Return ONLY valid JSON:
{
  "reputationScore": 1.0-5.0,
  "cultureScore": 1.0-5.0,
  "hiringScore": 1.0-5.0,
  "compensationScore": 1.0-5.0,
  "workLifeScore": 1.0-5.0,
  "leadershipScore": 1.0-5.0,
  "toxicityScore": 0.0-5.0,
  "engineeringScore": 1.0-5.0,
  "growthScore": 1.0-5.0,
  "confidence": 0.0-1.0,
  "factors": ["string"],
  "summary": "string"
}

Discussions:
${discussions}`;
}

export function buildWorkplacePrompt(
  companyName: string,
  discussions: string,
  focus?: string
): string {
  return `Analyze workplace culture for "${companyName}"${focus ? ` focusing on ${focus}` : ""}. Return ONLY valid JSON:
{
  "cultureInsights": ["string"],
  "engineeringCulture": ["string"],
  "hiringSentiment": ["string"],
  "managementStyle": ["string"],
  "compensationNotes": ["string"],
  "workLifeBalance": ["string"],
  "diversityInclusion": ["string"],
  "summary": "string"
}

Discussions:
${discussions}`;
}

export function buildToxicityPrompt(companyName: string, discussions: string): string {
  return `Analyze toxicity indicators for "${companyName}". Return ONLY valid JSON:
{
  "toxicityScore": 0.0-5.0,
  "indicators": ["string"],
  "severity": "low|medium|high",
  "examples": ["string"],
  "summary": "string"
}

Discussions:
${discussions}`;
}

export function buildCandidatePrompt(profile: string): string {
  return `Analyze this candidate profile for workplace fit and reputation. Return ONLY valid JSON:
{
  "headline": "string",
  "reputationScore": 1.0-5.0,
  "skills": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "cultureFit": ["string"],
  "summary": "string"
}

Profile:
${profile}`;
}
