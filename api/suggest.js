/**
 * POST /api/suggest
 * Body: { ideas: array, customPrompt?: string }
 *
 * If customPrompt is provided, uses it as the primary search instruction.
 * Otherwise falls back to preference-based suggestions from the existing list.
 */

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { ideas, customPrompt } = await req.json().catch(() => ({}));
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
  }

  const existingList = (ideas || [])
    .map(i => `- ${i.title} (${(i.tags || []).join(", ")})`)
    .join("\n");

  // Build the prompt based on mode
  const userInstruction = customPrompt
    ? `The user is looking for the following: "${customPrompt}"\n\nUse this as your primary guide. Take the request literally — if they mention a specific day, location, budget, occasion, or vibe, respect it closely. Draw on your knowledge of real venues, events, and activities to give specific, useful suggestions.`
    : `Look at the user's existing list below and suggest 3 NEW ideas that match their interests and style — things they haven't tried yet that feel like a natural fit.\n\nExisting list:\n${existingList}`;

  const prompt = `You are helping someone find great activity ideas. ${userInstruction}

${customPrompt && existingList ? `For context, here is their existing list of activities they enjoy:\n${existingList}\n` : ""}
Return exactly 3 suggestions. Respond ONLY as a JSON array — no markdown, no explanation, no code fences:

[
  {
    "title": "Short descriptive title",
    "emoji": "Single most relevant emoji",
    "location": "Venue name + full address + city + state",
    "lat": 37.0,
    "lng": -122.0,
    "when": "Specific day/time if known, or typical schedule/hours",
    "eventDate": null,
    "cost": "Full cost description",
    "costBadge": "Short label e.g. FREE or $50 for 2 or ~$30/person",
    "description": "2-3 engaging sentences about why this is great",
    "notes": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
    "tags": ["tag1", "tag2"],
    "link": "https://..."
  }
]

Rules:
- lat/lng must be accurate real coordinates for the location
- eventDate: use "YYYY-MM-DD" only if there is one specific date, otherwise null
- tags only from: Outdoor, Free, Science, Nighttime, Indoor, Music, Adventure, Classical, Water, Active, Hiking, Art, Splurge
- If the user mentioned a budget, respect it — don't suggest things over their budget
- If the user mentioned a location, all suggestions should be in or near that location
- If the user mentioned a date or day, note it in the "when" field
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
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.find(b => b.type === "text")?.text || "";
    const suggestions = JSON.parse(text.replace(/```json|```/g, "").trim());
    return new Response(JSON.stringify(suggestions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Couldn't generate suggestions." }), { status: 500 });
  }
}
