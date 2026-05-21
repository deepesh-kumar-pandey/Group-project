import { NextResponse } from "next/server";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Review Platform API</h1>
      <p>Backend-only workplace intelligence API. Use /api routes.</p>
      <ul>
        <li>GET /api/company/search?q=tesla</li>
        <li>GET /api/company/trending</li>
        <li>GET /api/company/[slug]</li>
        <li>GET /api/reddit/search?q=tesla</li>
        <li>POST /api/ai/summarize</li>
      </ul>
    </main>
  );
}
