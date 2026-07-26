"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import { aiChat, generateImage, isAIReady, isImageReady } from "@/lib/ai";
import { llmConcepts } from "@/config/prompts";
import { PromptWizard } from "@/components/arcade/prompt-wizard";

const promptTechniques = [
  { name: "Be specific", desc: "Give details: format, length, tone, subject", example: "Write a 5-sentence bedtime story about a brave robot, in a gentle tone" },
  { name: "Role prompting", desc: "Tell the AI who to be", example: "You are a friendly science teacher. Explain neural networks to a 10-year-old." },
  { name: "Few-shot", desc: "Give examples of what you want", example: "Happy: 'I love this!' Sad: 'I'm so disappointed.' Now classify: 'This is amazing!'" },
  { name: "Step-by-step", desc: "Ask the AI to think through it", example: "Think step by step: if I have 3 apples and give 1 away, how many do I have left?" },
];

export default function CreatorPage() {
  const { addXP, createProject } = useStore();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  // Art Studio state
  const [artPrompt, setArtPrompt] = useState("");
  const [artLoading, setArtLoading] = useState(false);
  const [artImage, setArtImage] = useState<string | null>(null);
  const [artError, setArtError] = useState<string | null>(null);
  const [artSaved, setArtSaved] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    setAiReady(isAIReady());
    setImgReady(isImageReady());
    const interval = setInterval(() => {
      if (isAIReady()) {
        setAiReady(true);
        setImgReady(isImageReady());
        if (isImageReady()) clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function run() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const result = await aiChat(prompt);
      setResponse(result);
      setHistory((h) => [...h.slice(-4), { prompt, response: result }]);
      addXP(15);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function generateArt() {
    if (!artPrompt.trim() || artLoading) return;
    setArtLoading(true);
    setArtError(null);
    setArtImage(null);
    setArtSaved(false);

    try {
      const imgUrl = await generateImage(artPrompt);
      if (imgUrl) {
        setArtImage(imgUrl);
        addXP(20);
      } else {
        setArtError("Could not generate image. Try a different prompt.");
      }
    } catch {
      setArtError("Image generation failed. Please try again.");
    } finally {
      setArtLoading(false);
    }
  }

  function saveArt() {
    if (!artImage || artSaved) return;
    createProject({
      title: artPrompt.slice(0, 40),
      emoji: "\u{1F3A8}",
      description: `AI-generated art: ${artPrompt}`,
      type: "art",
      prompt: artPrompt,
      tags: ["AI Art", "Generative", "Image"],
      html: `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0c0820;}img{max-width:90vw;max-height:90vh;border-radius:1rem;}</style></head><body><img src="${artImage}" alt="AI Art: ${artPrompt}"/></body></html>`,
    });
    addXP(30);
    setArtSaved(true);
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Creator"
        title="Prompt engineering lab"
        description="Write real prompts and see real AI responses. Experiment with techniques that make your prompts more powerful."
        center
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="rounded-4xl glass-strong p-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a prompt here... e.g., 'You are a friendly science teacher. Explain what a neural network is to a 10-year-old using a simple analogy.'"
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
            <span className="text-xs text-cloud-dim">
              {aiReady ? "AI connected" : "Connecting to AI..."}
            </span>
            <button
              onClick={run}
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Generating..." : "Run prompt"}
              {!loading && <Icon name="sparkles" className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-aurora-rose/10 px-4 py-3 text-sm text-aurora-rose">
            {error}
          </div>
        )}

        {(loading || response) && (
          <div ref={outputRef} className="mt-4 rounded-4xl glass p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-dim">AI response</p>
            {loading ? (
              <div className="flex items-center gap-2 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-cloud-dim animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="whitespace-pre-wrap leading-relaxed text-cloud">{response}</p>
              </motion.div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Recent prompts</p>
            <div className="space-y-2">
              {history.slice(-3).map((h, i) => (
                <div key={i} className="rounded-2xl glass p-4">
                  <p className="text-xs font-semibold text-aurora-violet">Prompt: {h.prompt.slice(0, 80)}{h.prompt.length > 80 ? "..." : ""}</p>
                  <p className="mt-1 text-sm text-cloud-muted">{h.response.slice(0, 120)}{h.response.length > 120 ? "..." : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Art Studio */}
      <div className="mt-14">
        <h2 className="mb-2 font-display text-2xl font-bold text-cloud">AI Art Studio</h2>
        <p className="mb-6 text-cloud-muted">
          Describe an image and watch real AI generate it. Powered by{" "}
          {imgReady ? "Puter.js image generation" : "connecting..."}.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prompt + controls */}
          <div className="space-y-4">
            <div className="rounded-4xl glass-strong p-2">
              <textarea
                value={artPrompt}
                onChange={(e) => setArtPrompt(e.target.value)}
                placeholder="A friendly robot painting a sunset in a watercolor style..."
                rows={3}
                className="w-full resize-none bg-transparent px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
              />
              <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                <span className="text-xs text-cloud-dim">
                  {imgReady ? "Image AI ready" : "Connecting..."}
                </span>
                <button
                  onClick={generateArt}
                  disabled={!artPrompt.trim() || artLoading || !imgReady}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-2 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-rose-500/40 disabled:opacity-50 active:scale-95"
                >
                  {artLoading ? "Painting..." : "Generate"}
                  {!artLoading && <span aria-hidden="true">{"\u{1F3A8}"}</span>}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "A cute robot exploring a forest",
                "A dragon made of stars",
                "A city floating in the clouds",
                "A friendly AI brain with rainbow colors",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setArtPrompt(suggestion)}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {artError && (
              <div className="rounded-2xl bg-aurora-rose/10 px-4 py-3 text-sm text-aurora-rose">
                {artError}
              </div>
            )}

            {artImage && (
              <button
                onClick={saveArt}
                disabled={artSaved}
                className={cn(
                  "w-full rounded-full px-5 py-2.5 font-display font-semibold transition-all active:scale-95",
                  artSaved
                    ? "bg-aurora-teal/20 text-aurora-teal"
                    : "bg-gradient-to-r from-aurora-teal to-aurora-violet text-night-950 hover:shadow-glow hover:shadow-aurora-violet/40",
                )}
              >
                {artSaved ? "Saved to portfolio!" : "Save to my portfolio"}
              </button>
            )}
          </div>

          {/* Image display */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-4xl glass-strong">
              <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
                  <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
                  <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
                </div>
                <span className="mx-auto text-xs text-cloud-dim">
                  {artLoading ? "Generating..." : artImage ? "AI Art" : "Canvas"}
                </span>
              </div>
              <div className="flex h-[400px] items-center justify-center bg-night-950/30">
                {artLoading ? (
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin-slow rounded-full border-2 border-pink-500/30 border-t-pink-500" />
                    <p className="mt-4 text-sm text-cloud-muted">
                      AI is painting your image...
                    </p>
                  </div>
                ) : artImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artImage}
                    alt={artPrompt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-5xl opacity-20">{"\u{1F3A8}"}</div>
                    <p className="mt-3 text-sm text-cloud-dim">
                      Describe an image and press Generate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-4 font-display text-2xl font-bold text-cloud">Prompt techniques to try</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {promptTechniques.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl glass p-5"
            >
              <h3 className="font-display font-semibold text-cloud">{tech.name}</h3>
              <p className="mt-1 text-sm text-cloud-muted">{tech.desc}</p>
              <button
                onClick={() => setPrompt(tech.example)}
                className="mt-3 rounded-full bg-white/5 px-3 py-1.5 text-xs text-aurora-teal ring-1 ring-white/10 transition-all hover:bg-white/10"
              >
                Try this prompt
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-2 font-display text-2xl font-bold text-cloud">LLM Explorer</h2>
        <p className="mb-6 text-cloud-muted">How Large Language Models work, explained as visual worlds.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {llmConcepts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-4xl glass p-6 transition-all hover:-translate-y-1"
            >
              <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", c.gradient)} />
              <div className="relative">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", c.gradient)}>
                  <span aria-hidden="true">{c.emoji}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-cloud">{c.term}</h3>
                <p className="text-xs font-medium text-aurora-violet">{c.analogy}</p>
                <p className="mt-2 text-sm leading-relaxed text-cloud-muted">{c.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-2 font-display text-2xl font-bold text-cloud">Prompt challenge</h2>
        <p className="mb-6 text-cloud-muted">Can you spot the better prompt? Test your skills.</p>
        <PromptWizard />
      </div>
    </div>
  );
}
