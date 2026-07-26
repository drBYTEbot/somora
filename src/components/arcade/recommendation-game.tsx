"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Movie {
  emoji: string;
  title: string;
  tags: string[];
}

const movies: Movie[] = [
  { emoji: "\u{1F318}", title: "Moon Adventure", tags: ["space", "action", "sci-fi"] },
  { emoji: "\u{1F431}", title: "Kitty Party", tags: ["cute", "funny", "animals"] },
  { emoji: "\u{1F680}", title: "Rocket Racers", tags: ["action", "fast", "space"] },
  { emoji: "\u{1F436}", title: "Dog Detectives", tags: ["animals", "mystery", "funny"] },
  { emoji: "\u{1F9DE}\u{FE0F}", title: "Dragon Quest", tags: ["fantasy", "action", "magic"] },
  { emoji: "\u{1F4A0}", title: "Brain Busters", tags: ["puzzle", "smart", "funny"] },
  { emoji: "\u{1F3A0}", title: "Carnival Mystery", tags: ["mystery", "funny", "magic"] },
  { emoji: "\u{1F916}", title: "Robot Buddy", tags: ["sci-fi", "cute", "action"] },
];

export function RecommendationGame() {
  const { recordGamePlay, addXP } = useStore();
  const [liked, setLiked] = useState<string[]>([]);
  const [phase, setPhase] = useState<"rate" | "results">("rate");
  const [recommended, setRecommended] = useState<Movie | null>(null);

  function toggle(tag: string) {
    setLiked((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function getRecommendation() {
    const scored = movies.map((m) => ({
      ...m,
      score: m.tags.filter((t) => liked.includes(t)).length,
    }));
    scored.sort((a, b) => b.score - a.score);
    setRecommended(scored[0]);
    setPhase("results");
    recordGamePlay("recommendation", liked.length);
    addXP(30);
  }

  const allTags = [...new Set(movies.flatMap((m) => m.tags))];

  if (phase === "results" && recommended) {
    return (
      <div className="rounded-4xl glass-strong p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-aurora-teal">AI recommends</p>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4">
          <div className="text-7xl">{recommended.emoji}</div>
          <h3 className="mt-3 font-display text-2xl font-bold text-cloud">{recommended.title}</h3>
          <div className="mt-2 flex justify-center gap-2">
            {recommended.tags.map((t) => (
              <span key={t} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", liked.includes(t) ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/5 text-cloud-dim")}>{t}</span>
            ))}
          </div>
          <p className="mt-3 text-sm text-cloud-muted">
            The AI matched {recommended.tags.filter((t) => liked.includes(t)).length} of your interests!
          </p>
        </motion.div>
        <Button onClick={() => { setPhase("rate"); setLiked([]); setRecommended(null); }} variant="outline" className="mt-6">Try again</Button>
      </div>
    );
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <h3 className="font-display text-xl font-bold text-cloud">Recommendation Engine</h3>
      <p className="mt-1 text-sm text-cloud-muted">Pick what you like! The AI will recommend the perfect movie for you.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all active:scale-95",
              liked.includes(tag) ? "bg-gradient-to-r from-aurora-teal to-aurora-violet text-night-950" : "bg-white/5 text-cloud-muted ring-1 ring-white/10 hover:bg-white/10",
            )}
          >
            {liked.includes(tag) ? "\u2705 " : ""}{tag}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-cloud-dim">
        {liked.length === 0 ? "Pick at least 1 thing you like!" : `${liked.length} things selected`}
      </div>

      <Button onClick={getRecommendation} disabled={liked.length === 0} className="mt-4 w-full">
        Get my recommendation! {"\u{1F3AF}"}
      </Button>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {movies.map((m) => {
          const matchScore = m.tags.filter((t) => liked.includes(t)).length;
          return (
            <div key={m.title} className={cn("rounded-2xl p-3 text-center transition-all", matchScore > 0 ? "bg-aurora-teal/5" : "bg-white/[0.02]")}>
              <div className="text-2xl opacity-50">{m.emoji}</div>
              <p className="mt-1 text-[9px] text-cloud-dim">{m.title}</p>
              {matchScore > 0 && <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-aurora-teal" style={{ width: `${matchScore / m.tags.length * 100}%` }} /></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
