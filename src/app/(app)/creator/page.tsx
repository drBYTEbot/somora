"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import { aiChat, generateImage, isAIReady, isImageReady } from "@/lib/ai";
import { PromptWizard } from "@/components/arcade/prompt-wizard";

const ideaButtons = [
  { emoji: "\u{1F4D6}", label: "Tell me a story", prompt: "Tell me a short bedtime story about a brave robot who helps a lost child find their way home." },
  { emoji: "\u{1F9E0}", label: "Explain AI simply", prompt: "Explain what artificial intelligence is like I'm 10 years old, using a fun analogy." },
  { emoji: "\u{1F4DD}", label: "Help with homework", prompt: "I need help understanding photosynthesis. Can you explain it step by step with a fun example?" },
  { emoji: "\u{1F3AE}", label: "Make a game idea", prompt: "Help me think of a fun game idea I could build that teaches kids about AI." },
  { emoji: "\u{1F4A1}", label: "Teach me something", prompt: "Teach me one cool thing about how computers think. Make it fun and easy to understand!" },
  { emoji: "\u{1F9D9}", label: "Be creative", prompt: "Make up a funny riddle about robots for me to solve!" },
];

const artIdeas = [
  { emoji: "\u{1F916}", label: "A cute robot", prompt: "A cute friendly robot waving hello, colorful cartoon style" },
  { emoji: "\u{1F431}", label: "A space cat", prompt: "A cat astronaut floating in space with stars, cartoon style" },
  { emoji: "\u{1F431}", label: "A dragon", prompt: "A baby dragon made of stars and galaxies, cute and friendly" },
  { emoji: "\u{1F30D}", label: "A floating city", prompt: "A magical city floating in the clouds with rainbow bridges" },
];

export default function CreatorPage() {
  const { addXP } = useStore();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Art state
  const [artPrompt, setArtPrompt] = useState("");
  const [artLoading, setArtLoading] = useState(false);
  const [artImage, setArtImage] = useState<string | null>(null);
  const [artError, setArtError] = useState<string | null>(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if (isAIReady()) {
        setReady(true);
        setImgReady(isImageReady());
        if (isImageReady()) clearInterval(check);
      }
    }, 1000);
    return () => clearInterval(check);
  }, []);

  async function run() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResponse("");
    try {
      const result = await aiChat(prompt);
      setResponse(result);
      addXP(15);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  async function generateArt() {
    if (!artPrompt.trim() || artLoading) return;
    setArtLoading(true);
    setArtError(null);
    setArtImage(null);
    try {
      const url = await generateImage(artPrompt);
      if (url) {
        setArtImage(url);
        addXP(20);
      } else {
        setArtError("AI couldn't make that image. Try a different prompt!");
      }
    } catch (err) {
      setArtError(err instanceof Error ? err.message : "Something went wrong. Try again!");
    } finally {
      setArtLoading(false);
    }
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-cloud sm:text-4xl">Talk to AI!</h1>
        <p className="mt-3 text-cloud-muted">
          Type something or pick an idea below. The AI will talk back to you!
          {!ready && <span className="mt-2 block text-xs text-aurora-amber">{"\u26A0\u{FE0F}"} Connecting to AI... If a popup appears, that&apos;s OK! Just close it.</span>}
        </p>
      </div>

      {/* Chat box */}
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="rounded-4xl glass-strong p-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type anything you want to ask the AI..."
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
            <span className="text-xs text-cloud-dim">{ready ? "AI is ready!" : "Connecting..."}</span>
            <button
              onClick={run}
              disabled={!prompt.trim() || loading || !ready}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Thinking..." : "Ask AI!"}
              {!loading && <Icon name="sparkles" className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Quick ideas */}
        <div className="mt-4">
          <p className="mb-2 text-center text-xs text-cloud-dim">Or pick an idea:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ideaButtons.map((idea) => (
              <button
                key={idea.label}
                onClick={() => setPrompt(idea.prompt)}
                className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-sm text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
              >
                <span>{idea.emoji}</span>
                {idea.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-aurora-rose/10 px-4 py-3 text-sm text-aurora-rose">{error}</div>
        )}

        {(loading || response) && (
          <div ref={outputRef} className="mt-4 rounded-4xl glass p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-dim">AI says:</p>
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
      </div>

      {/* AI Art Studio */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="mb-4 text-center">
          <h2 className="font-display text-2xl font-bold text-cloud">AI Art Studio {"\u{1F3A8}"}</h2>
          <p className="mt-1 text-sm text-cloud-muted">Describe a picture and watch AI paint it!</p>
        </div>

        <div className="flex gap-2">
          <input
            value={artPrompt}
            onChange={(e) => setArtPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateArt()}
            placeholder="A cute robot painting a sunset..."
            className="flex-1 rounded-2xl bg-night-950/50 px-4 py-3 text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
          />
          <button
            onClick={generateArt}
            disabled={!artPrompt.trim() || artLoading || !imgReady}
            className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-rose-500/40 disabled:opacity-50 active:scale-95"
          >
            {artLoading ? "Painting..." : "Create!"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {artIdeas.map((idea) => (
            <button key={idea.label} onClick={() => setArtPrompt(idea.prompt)} className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-sm text-cloud-muted ring-1 ring-white/10 hover:bg-white/10 hover:text-cloud">
              <span>{idea.emoji}</span>
              {idea.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex h-64 items-center justify-center overflow-hidden rounded-4xl glass">
          {artLoading ? (
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin-slow rounded-full border-2 border-pink-500/30 border-t-pink-500" />
              <p className="mt-3 text-sm text-cloud-muted">AI is painting...</p>
            </div>
          ) : artImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={artImage} alt={artPrompt} className="h-full w-full object-cover" />
          ) : artError ? (
            <p className="text-sm text-aurora-rose">{artError}</p>
          ) : (
            <div className="text-center">
              <div className="text-5xl opacity-20">{"\u{1F3A8}"}</div>
              <p className="mt-2 text-sm text-cloud-dim">Describe something and press Create!</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt challenge */}
      <div className="mx-auto mt-12 max-w-2xl">
        <div className="mb-4 text-center">
          <h2 className="font-display text-2xl font-bold text-cloud">Prompt Challenge {"\u{1F9D9}"}</h2>
          <p className="mt-1 text-sm text-cloud-muted">Can you pick the better prompt? Test your skills!</p>
        </div>
        <PromptWizard />
      </div>
    </div>
  );
}
