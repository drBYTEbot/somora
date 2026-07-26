import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_ROUTER = "https://router.huggingface.co/v1/chat/completions";

const STUDIO_PROMPT = `You are an app builder for kids. Generate a working HTML app as JSON only. No markdown, no explanation.

JSON format:
{"title":"App name","emoji":"emoji","type":"game","description":"one sentence","components":[{"name":"part","desc":"what it does"}],"howItWorks":"2 sentences","tags":["tag1","tag2"],"html":"<!DOCTYPE html>...complete working app with inline CSS and JS, no external deps, under 3000 chars, big fonts, colorful, kid-friendly>"}

Rules: Full HTML doc. Inline CSS+JS only. No external resources. Must actually work. Keep HTML under 3000 characters.`;

async function callHF(idea: string, maxTokens: number): Promise<string> {
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
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`HF ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response");
  }
  return text;
}

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured. Check HUGGINGFACE_API_KEY env var." }, { status: 500 });
  }

  try {
    const { idea } = await req.json();

    let text: string;
    try {
      // First try with 2000 tokens
      text = await callHF(idea, 2000);
    } catch {
      // Retry with fewer tokens (faster)
      try {
        text = await callHF(idea, 1500);
      } catch (err2) {
        console.error("generate-app retry failed:", err2);
        return NextResponse.json(
          { error: "AI is busy right now. Try again in a moment!" },
          { status: 500 },
        );
      }
    }

    // Remove markdown fences
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", text.slice(0, 300));
      return NextResponse.json({ error: "AI response was not valid JSON. Try again!" }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // Try to fix common JSON issues (trailing commas, unescaped quotes)
      const cleaned = jsonMatch[0]
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      parsed = JSON.parse(cleaned);
    }

    if (!parsed.html || !parsed.html.trim()) {
      return NextResponse.json({ error: "AI did not generate app code. Try again!" }, { status: 500 });
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("generate-app error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed." },
      { status: 500 },
    );
  }
}
