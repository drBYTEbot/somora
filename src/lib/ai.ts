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

export function isImageReady(): boolean {
  return typeof window !== "undefined" && !!window.puter?.ai?.txt2img;
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
8. For chatbots: pre-program 5-8 responses based on keywords. Show messages in a chat UI.
9. For games: make it actually playable with score tracking. Use keyboard or click controls.
10. For stories: generate a random story from arrays of words when a button is clicked.
11. For classifiers: let kids click to classify items and show if they're right.
12. For tools: make the tool actually functional (calculator, quiz generator, etc.).
13. Keep the HTML under 4000 characters. Be concise but complete.
14. Escape all special characters properly so the JSON is valid.

Make it feel magical — like the child just built something real.`;

export interface StudioResult {
  title: string;
  emoji: string;
  type: string;
  description: string;
  components: { name: string; desc: string }[];
  howItWorks: string;
  tags: string[];
  html: string;
}

export async function generateApp(userIdea: string): Promise<StudioResult> {
  if (!isAIReady()) {
    throw new Error("AI is not available. Please refresh the page.");
  }

  try {
    const response = await window.puter!.ai.chat(
      [
        { role: "system", content: STUDIO_SYSTEM_PROMPT },
        { role: "user", content: `Build this app idea: "${userIdea}"` },
      ] as any,
      { model: "gpt-4o-mini", temperature: 0.8, max_tokens: 4000 },
    );

    let text: string;
    if (typeof response === "string") text = response;
    else if (response && typeof response === "object") {
      const r = response as { message?: { content?: string } };
      text = r.message?.content ?? "";
    } else text = String(response ?? "");

    // Remove markdown fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");

    const parsed = JSON.parse(jsonMatch[0]) as StudioResult;

    if (!parsed.html || !parsed.html.trim()) {
      throw new Error("AI did not generate app code. Try again.");
    }

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
  if (!isImageReady()) return null;
  try {
    const img = await window.puter!.ai!.txt2img(prompt);
    if (img instanceof HTMLImageElement && img.src) return img.src;
    return null;
  } catch {
    return null;
  }
}

/** Encode HTML into a shareable URL hash */
export function encodeAppForSharing(html: string): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(html)));
    return `/view#data=${encoded}`;
  } catch {
    return "";
  }
}

/** Decode HTML from a URL hash */
export function decodeAppFromHash(hash: string): string | null {
  try {
    const match = hash.match(/[#&]data=([^&]+)/);
    if (!match) return null;
    const decoded = decodeURIComponent(escape(atob(match[1])));
    return decoded;
  } catch {
    return null;
  }
}

export {};
