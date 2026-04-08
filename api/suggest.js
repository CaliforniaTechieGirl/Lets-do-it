/**
 * POST /api/suggest
 * Body: { ideas: array of current ideas }
 * Returns: array of 3 suggestion objects
 */

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { ideas } = await req.json().catch(() => ({}));
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
  }

  const summary = (ideas || []).map((i) => `- ${i.title} (${(i.tags || []).join(", ")})`).join("\n");

  const prompt = `You are helping a group find great activity ideas. Based on their current list, suggest exactly 3 NEW ideas they haven't tried yet.

Current list:
${summary}

Return ONLY a JSON array, no markdown:
[{"title":"...","emoji":"...","location":"Full address, City, State","lat":null,"lng":null,"when":"...","eventDate":null,"cost":"...","costBadge":"...","description":"2-3 sentences.","notes":["...","...","..."],"tags":["..."],"link":"https://..."}]

Rules:
- tags only from: Outdoor, Free, Science, Nighttime, Indoor, Music, Adventure, Classical, Water, Active, Hiking, Art, Splurge
- eventDate is null unless it's a specific upcoming date (YYYY-MM-DD)
- lat/lng should be null
- Return ONLY the raw JSON array`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.find((b) => b.type === "text")?.text || "";
    const suggestions = JSON.parse(text.replace(/```json|```/g, "").trim());
    return new Response(JSON.stringify(suggestions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Couldn't generate suggestions." }), { status: 500 });
  }
}
