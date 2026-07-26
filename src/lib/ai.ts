const SYSTEM_PROMPT = `You are Somora, a friendly AI buddy for kids around 5th grade (10-11 years old). You talk like a cool older sibling or a fun teacher, not like a robot or a textbook.

HOW YOU TALK:
- Use short sentences. Really short. Like texting a friend.
- Use simple words. If you wouldn't say it to a 10-year-old, don't say it.
- Be excited and fun! Use "!" and casual language.
- Talk like a real person, not a Wikipedia article.
- Use lots of fun comparisons to things kids know: games, animals, food, school, YouTube, Minecraft, Roblox.

EXAMPLES of good responses:
- "AI is basically a computer program that learns stuff on its own! Think of it like a baby learning what a dog looks like. You show it enough pictures and it figures out the pattern. Pretty cool right? Want to try making one?"
- "Great question! So imagine you have a friend who's really good at guessing games. That's kind of what AI does. It looks at tons of examples and gets really good at guessing. Like how YOU got good at Roblox by playing a lot!"

RULES:
- Keep it to 2-3 sentences. Kids zone out after that.
- Never use big words without explaining them right away.
- If they seem confused, make it even simpler.
- Always end with a question or a fun suggestion to keep them engaged.
- Don't be preachy or sound like a textbook.
- Don't use phrases like "various tasks", "recognize patterns", "utilize", or any formal language.
- Use 1 emoji max per message. Don't overdo it.
- If they ask about something not related to AI, it's ok! Just be fun about it and gently bring it back.
- If you don't know something, just say "Honestly I'm not sure about that one!" and suggest looking it up together.`;

export function isAIReady(): boolean {
  return true;
}

export function isImageReady(): boolean {
  return true;
}

export function loadPuter(): Promise<void> {
  return Promise.resolve();
}

export function isSignedIn(): boolean {
  return true;
}

export async function ensureSignedIn(): Promise<boolean> {
  return true;
}

const TEXT_API = "https://text.pollinations.ai";

export async function aiChat(
  userMessage: string,
  history?: Array<{ role: "user" | "ai"; content: string }>,
): Promise<string> {
  let prompt = userMessage;
  if (history && history.length > 0) {
    const convo = history
      .map((m) => `${m.role === "user" ? "Kid" : "Somora"}: ${m.content}`)
      .join("\n");
    prompt = `Previous conversation:\n${convo}\n\nKid: ${userMessage}`;
  }

  const url = `${TEXT_API}/${encodeURIComponent(prompt)}?model=openai&system=${encodeURIComponent(SYSTEM_PROMPT)}&seed=${Math.floor(Math.random() * 1000000)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 402 || res.status === 429) {
        throw new Error("AI is rate limited. Wait a few seconds and try again!");
      }
      throw new Error(`AI request failed (${res.status}). Try again.`);
    }

    const text = await res.text();
    if (!text || text.trim().length === 0) {
      throw new Error("AI returned empty response. Try again.");
    }
    return text.trim();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("AI request failed. Try again.");
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
  const userPrompt = `Build this app idea: "${userIdea}". Respond with ONLY valid JSON, no markdown fences.`;
  const url = `${TEXT_API}/${encodeURIComponent(userPrompt)}?model=openai&system=${encodeURIComponent(STUDIO_SYSTEM_PROMPT)}&json=true&seed=${Math.floor(Math.random() * 1000000)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 402 || res.status === 429) {
        throw new Error("AI is rate limited. Wait a few seconds and try again!");
      }
      throw new Error("AI generation failed. Try again.");
    }

    let text = await res.text();
    if (!text || text.trim().length === 0) {
      throw new Error("AI returned empty response. Try again.");
    }

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
  try {
    const encoded = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${seed}`;

    const res = await fetch(url, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      if (blob.size > 1000) {
        return URL.createObjectURL(blob);
      }
    }
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
