declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (
          prompt: string | Array<{ role: string; content: string }>,
          options?: {
            model?: string;
            stream?: boolean;
            temperature?: number;
            max_tokens?: number;
          },
        ) => Promise<string | { message?: { content?: string } }>;
        txt2img: (prompt: string) => Promise<HTMLImageElement>;
      };
    };
  }
}

const SYSTEM_PROMPT = `You are Somora AI, a friendly, encouraging personal AI tutor for children ages 8-16. Your job is to help them learn about Artificial Intelligence in a fun, accessible way.

Rules:
- Always explain things simply, using analogies a child would understand.
- Be warm, curious, and encouraging. Never condescending.
- When explaining technical concepts, use real-world examples (cooking, sports, animals, games).
- Keep responses concise (2-4 sentences for simple questions, up to 6-8 for complex ones).
- If a child asks something off-topic, gently steer back to learning.
- Encourage hands-on building: suggest trying things in Somora Studio, Arcade, or Labs.
- Never give the direct answer to a homework problem — guide them to find it.
- Use emojis sparingly to feel friendly, but stay educational.
- If you don't know something, say so honestly.`;

export function isAIReady(): boolean {
  return typeof window !== "undefined" && !!window.puter?.ai?.chat;
}

export async function aiChat(
  userMessage: string,
  history?: Array<{ role: "user" | "ai"; content: string }>,
): Promise<string> {
  if (!isAIReady()) {
    throw new Error("AI is not available. Please refresh the page.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history ?? []).map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await window.puter!.ai.chat(
      messages as any,
      { model: "gpt-4o-mini", temperature: 0.7, max_tokens: 500 },
    );

    // Handle different response shapes
    if (typeof response === "string") return response;
    if (response && typeof response === "object") {
      const r = response as { message?: { content?: string } };
      if (r.message?.content) return r.message.content;
    }
    return String(response ?? "");
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "AI request failed. Try again.",
    );
  }
}

const STUDIO_SYSTEM_PROMPT = `You are Somora Studio, an AI app builder for children. When a child describes an app idea, you respond with a JSON object describing what to build.

Always respond with ONLY valid JSON (no markdown fences) in this exact format:
{
  "title": "A catchy name for the app",
  "emoji": "A single emoji representing the app",
  "type": "chatbot | classifier | story | game | tool",
  "description": "One sentence describing what the app does",
  "components": [
    { "name": "Component name", "desc": "What this part does, explained simply" }
  ],
  "howItWorks": "A 2-3 sentence kid-friendly explanation of how the app works",
  "tags": ["tag1", "tag2", "tag3"]
}

Keep language simple and encouraging. 3-5 components max.`;

export interface StudioResult {
  title: string;
  emoji: string;
  type: string;
  description: string;
  components: { name: string; desc: string }[];
  howItWorks: string;
  tags: string[];
}

export async function generateApp(userIdea: string): Promise<StudioResult> {
  if (!isAIReady()) {
    throw new Error("AI is not available. Please refresh the page.");
  }

  try {
    const response = await window.puter!.ai.chat(
      [
        { role: "system", content: STUDIO_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Build this app idea: "${userIdea}"`,
        },
      ] as any,
      { model: "gpt-4o-mini", temperature: 0.8, max_tokens: 800 },
    );

    let text: string;
    if (typeof response === "string") text = response;
    else if (response && typeof response === "object") {
      const r = response as { message?: { content?: string } };
      text = r.message?.content ?? "";
    } else text = String(response ?? "");

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    const parsed = JSON.parse(jsonMatch[0]) as StudioResult;
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error("AI returned an invalid response. Try rephrasing your idea.");
    }
    throw new Error(
      err instanceof Error ? err.message : "Generation failed. Try again.",
    );
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  if (!isAIReady() || !window.puter?.ai?.txt2img) return null;
  try {
    const img = await window.puter.ai.txt2img(prompt);
    if (img instanceof HTMLImageElement && img.src) return img.src;
    return null;
  } catch {
    return null;
  }
}

export {};
