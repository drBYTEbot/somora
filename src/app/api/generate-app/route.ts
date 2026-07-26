import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_ROUTER = "https://router.huggingface.co/v1/chat/completions";

const STUDIO_PROMPT = `You are an app builder for kids. Generate a working HTML app as JSON only. No markdown, no explanation.

JSON format:
{"title":"App name","emoji":"emoji","type":"game","description":"one sentence","components":[{"name":"part","desc":"what it does"}],"howItWorks":"2 sentences","tags":["tag1","tag2"],"html":"<!DOCTYPE html>...complete working app with inline CSS and JS, no external deps, under 3000 chars, big fonts, colorful, kid-friendly>"}

Rules: Full HTML doc. Inline CSS+JS only. No external resources. Must actually work. Keep HTML under 3000 characters.`;

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  try {
    const { idea } = await req.json();

    const res = await fetch(HF_ROUTER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: STUDIO_PROMPT },
          { role: "user", content: `Build: ${idea}` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: false,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      console.error("HF generate-app error:", res.status, errText);
      return NextResponse.json(
        { error: `AI generation failed (${res.status}).` },
        { status: 500 },
      );
    }

    const data = await res.json();
    let text = data?.choices?.[0]?.message?.content ?? "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "AI returned empty response." }, { status: 500 });
    }

    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");

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
      return NextResponse.json({ error: "AI returned invalid JSON. Try again." }, { status: 500 });
    }
    console.error("generate-app error:", err);
    return NextResponse.json({ error: "Generation took too long. Try a simpler idea." }, { status: 500 });
  }
}
