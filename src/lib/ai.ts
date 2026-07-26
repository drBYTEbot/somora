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

export async function aiChat(
  userMessage: string,
  history?: Array<{ role: "user" | "ai"; content: string }>,
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? `AI request failed (${res.status}).`);
    }

    const data = await res.json();
    if (!data.reply) {
      throw new Error("AI returned empty response. Try again.");
    }
    return data.reply;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("AI request failed. Try again.");
  }
}

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
  try {
    const res = await fetch("/api/generate-app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: userIdea }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? `Generation failed (${res.status}).`);
    }

    const data = await res.json();
    if (!data.result) {
      throw new Error("AI did not generate a valid response. Try again.");
    }
    return data.result as StudioResult;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Generation failed. Try again.");
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      console.error("Image generation failed:", res.status);
      return null;
    }

    const data = await res.json();
    if (data.url) return data.url;
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
