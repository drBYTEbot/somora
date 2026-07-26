"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { generateImage, isImageReady } from "@/lib/ai";

const prompts = [
  "A cute robot painting a sunset",
  "A dragon made of stars",
  "A city floating in the clouds",
  "A friendly AI brain with rainbow colors",
];

export function AIArtist() {
  const { recordGamePlay, addXP } = useStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if (isImageReady()) {
        setReady(true);
        clearInterval(check);
      }
    }, 1000);
    return () => clearInterval(check);
  }, []);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const url = await generateImage(prompt);
      if (url) {
        setImage(url);
        recordGamePlay("ai-artist", 1);
        addXP(30);
      } else {
        setError("Could not generate. Try again!");
      }
    } catch {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <h3 className="font-display text-xl font-bold text-cloud">AI Artist</h3>
      <p className="mt-1 text-sm text-cloud-muted">Describe any picture and watch real AI paint it!</p>

      <div className="mt-4 flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="A cute robot exploring a forest..."
          className="flex-1 rounded-2xl bg-night-950/50 px-4 py-3 text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
        />
        <button
          onClick={generate}
          disabled={!prompt.trim() || loading || !ready}
          className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-3 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-rose-500/40 disabled:opacity-50 active:scale-95"
        >
          {loading ? "Painting..." : "Create!"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button key={p} onClick={() => setPrompt(p)} className="rounded-full bg-white/5 px-3 py-1 text-xs text-cloud-muted ring-1 ring-white/10 hover:bg-white/10 hover:text-cloud">
            {p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-night-950/40">
        {loading ? (
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin-slow rounded-full border-2 border-pink-500/30 border-t-pink-500" />
            <p className="mt-3 text-sm text-cloud-muted">AI is painting...</p>
          </div>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={image} alt={prompt} className="h-full w-full object-cover" />
        ) : error ? (
          <p className="text-sm text-aurora-rose">{error}</p>
        ) : (
          <div className="text-center">
            <div className="text-5xl opacity-20">{"\u{1F3A8}"}</div>
            <p className="mt-2 text-sm text-cloud-dim">Describe something and press Create!</p>
          </div>
        )}
      </div>
    </div>
  );
}
