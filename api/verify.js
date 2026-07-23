// Vercel Serverless Function — proxies to Gemini API for deadline verification
// Set GEMINI_API_KEY in Vercel Environment Variables

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  const { conferences } = req.body;
  if (!conferences || !Array.isArray(conferences)) {
    return res.status(400).json({ error: "Missing conferences array" });
  }

  const prompt = `You are a research conference deadline verification bot. For each conference below, search the web to find the current official submission deadline from their CFP page.

Return ONLY a valid JSON array (no markdown, no backticks, no explanation) with objects like:
[{"id":"conf-id","deadline":"YYYY-MM-DD or null if not found","notify":"YYYY-MM-DD or null","changed":true/false,"note":"brief note if deadline changed or was extended"}]

The "changed" field should be true ONLY if the real deadline you found differs from what we currently have. If you cannot find updated info, set changed to false and keep the existing deadline.

Conferences to verify:
${conferences.map(c => `ID: ${c.id} | ${c.name} ${c.cycle} | Search: ${c.sq} | Our deadline: ${c.deadline} | Our notify: ${c.notify} | URL: ${c.url}`).join("\n")}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    // Extract text from Gemini response
    let text = "";
    if (data.candidates?.[0]?.content?.parts) {
      text = data.candidates[0].content.parts
        .filter((p) => p.text)
        .map((p) => p.text)
        .join("");
    }

    // Clean up the response
    text = text.replace(/```json|```/g, "").trim();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Failed to verify deadlines", text: "[]" });
  }
}
