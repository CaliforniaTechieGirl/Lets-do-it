/**
 * POST /api/parse-url
 * Body: { url: string }
 *
 * Fetches the page at `url`, sends the content to Claude,
 * and returns a structured idea object ready to add to the list.
 *
 * The Anthropic API key lives in ANTHROPIC_API_KEY env var —
 * never exposed to the browser.
 */

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { url } = await req.json().catch(() => ({}));
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url" }), { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
  }

  // ── 1. Fetch the page ───────────────────────────────────────────────────────
  let pageText = "";
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LetsDoItBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await pageRes.text();
    // Strip tags, collapse whitespace, cap at 6000 chars
    pageText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not fetch that URL. Try a different link." }), { status: 422 });
  }

  // ── 2. Ask Claude to parse it ───────────────────────────────────────────────
  const prompt = `You are helping parse a webpage into a structured activity idea for a collaborative planning app called "Let's Do It".

The user pasted this URL: ${url}

Here is the page content (truncated):
---
${pageText}
---

Extract the following fields and return ONLY a JSON object, no markdown, no explanation:

{
  "title": "Short descriptive title",
  "emoji": "Single most relevant emoji",
  "location": "Full address or venue name + city + state if available",
  "lat": null,
  "lng": null,
  "when": "When this happens — specific date/time if available, or recurring schedule, or hours",
  "eventDate": null,
  "cost": "Full cost description",
  "costBadge": "Very short cost label e.g. FREE or $50 for 2 or ~$30/person",
  "description": "2-3 sentence engaging description of the activity",
  "notes": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "tags": ["tag1", "tag2"],
  "link": "${url}"
}

Rules:
- eventDate: use "YYYY-MM-DD" only if there is one specific upcoming date, otherwise null
- lat/lng: null (we don't have geocoding here)
- tags must only be chosen from: Outdoor, Free, Science, Nighttime, Indoor, Music, Adventure, Classical, Water, Active, Hiking, Art, Splurge
- If cost appears to be free, set costBadge to "FREE"
- Return ONLY the raw JSON object`;

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await claudeRes.json();
    const text = data.content?.find((b) => b.type === "text")?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const idea = JSON.parse(clean);

    return new Response(JSON.stringify(idea), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Couldn't parse the page content. Try a more specific event or venue URL." }),
      { status: 422 }
    );
  }
}
