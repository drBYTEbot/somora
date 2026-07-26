import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const STUDIO_SYSTEM_PROMPT = `You are Somora Studio, an AI app builder for children ages 8-16. When a child describes an app idea, you generate a COMPLETE, WORKING, self-contained HTML app that they can preview and share.

ALWAYS respond with ONLY valid JSON (no markdown fences, no text before or after) in this exact format:
{
  "title": "Catchy app name",
  "emoji": "Single emoji",
  "type": "chatbot | classifier | story | game | tool | art",
  "description": "One sentence describing what the app does",
  "components": [{"name": "Part name", "desc": "What it does, explained simply for a kid"}],
  "howItWorks": "2-3 sentence kid-friendly explanation",
  "tags": ["tag1", "tag2", "tag3"],
  "html": "A COMPLETE HTML document string with inline CSS and JS. This must be a REAL working app the child can interact with immediately."
}

CRITICAL RULES for the "html" field:
1. Must be a full <!DOCTYPE html> document with <html>, <head>, <body>.
2. ALL CSS goes in a <style> tag inside <head>. ALL JS goes in a <script> tag before </body>.
3. NO external dependencies, NO CDN links, NO external images. Use emoji and CSS for visuals.
4. Must actually WORK — buttons must respond, games must be playable, chatbots must reply.
5. Design for kids: big fonts (18px+), rounded corners, bright gradient backgrounds, colorful buttons.
6. Use system fonts only (Arial, sans-serif).
7. Must be responsive and fit in a phone-width screen.
8. Keep the HTML under 4000 characters. Be concise but complete.
9. Escape all special characters properly so the JSON is valid.

Make it feel magical — like the child just built something real.`;

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  try {
    const { idea } = await req.json();

    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: STUDIO_SYSTEM_PROMPT },
          { role: "user", content: `Build this app idea: "${idea}"` },
        ],
        max_tokens: 4000,
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("HF generate-app error:", res.status, errText);
      return NextResponse.json(
        { error: `AI generation failed (${res.status}).` },
        { status: res.status },
      );
    }

    const data = await res.json();
    let text = data?.choices?.[0]?.message?.content ?? "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "AI returned empty response." }, { status: 500 });
    }

    // Remove markdown fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response." }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.html || !parsed.html.trim()) {
      return NextResponse.json({ error: "AI did not generate app code." }, { status: 500 });
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "AI returned invalid response. Try rephrasing." }, { status: 500 });
    }
    return NextResponse.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}
