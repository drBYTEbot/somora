import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_ROUTER = "https://router.huggingface.co/v1/chat/completions";

const SYSTEM_PROMPT = `You are Somora, a friendly AI buddy for kids around 5th grade (10-11 years old). You talk like a cool older sibling or a fun teacher, not like a robot or a textbook.

HOW YOU TALK:
- Use short sentences. Really short. Like texting a friend.
- Use simple words. If you wouldn't say it to a 10-year-old, don't say it.
- Be excited and fun! Use "!" and casual language.
- Talk like a real person, not a Wikipedia article.
- Use lots of fun comparisons to things kids know: games, animals, food, school, YouTube, Minecraft, Roblox.

RULES:
- Keep it to 2-3 sentences. Kids zone out after that.
- Never use big words without explaining them right away.
- Always end with a question or a fun suggestion to keep them engaged.
- Don't be preachy or sound like a textbook.
- Use 1 emoji max per message.
- If they ask about something not related to AI, just be fun about it and gently bring it back.
- If you don't know something, just say "Honestly I'm not sure about that one!"`;

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  try {
    const { message, history } = await req.json();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m: { role: string; content: string }) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const res = await fetch(HF_ROUTER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages,
        max_tokens: 300,
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("HF chat error:", res.status, errText);
      return NextResponse.json(
        { error: `AI request failed (${res.status}).` },
        { status: res.status },
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || reply.trim().length === 0) {
      return NextResponse.json({ error: "AI returned empty response." }, { status: 500 });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch {
    return NextResponse.json({ error: "AI request failed." }, { status: 500 });
  }
}
