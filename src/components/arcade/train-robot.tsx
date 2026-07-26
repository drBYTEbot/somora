"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Sample {
  emoji: string;
  label: "cat" | "dog";
}

const pool: Sample[] = [
  { emoji: "\u{1F431}", label: "cat" },
  { emoji: "\u{1F436}", label: "dog" },
  { emoji: "\u{1F408}", label: "cat" },
  { emoji: "\u{1F415}", label: "dog" },
  { emoji: "\u{1F63A}", label: "cat" },
  { emoji: "\u{1F429}", label: "dog" },
  { emoji: "\u{1F638}", label: "cat" },
  { emoji: "\u{1F9AE}", label: "dog" },
  { emoji: "\u{1F63B}", label: "cat" },
  { emoji: "\u{1F94D}", label: "dog" },
];

function pickFromPool(exclude?: number): number {
  let idx;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (idx === exclude);
  return idx;
}

export function TrainRobot() {
  const { recordGamePlay, unlockAchievement } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [labeled, setLabeled] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [accuracy, setAccuracy] = useState(0);

  const current = pool[currentIdx];
  const trained = labeled;
  const acc = trained >= 2 ? Math.min(98, 45 + (correct / trained) * 50) : 0;

  function label(guess: "cat" | "dog") {
    if (feedback !== null) return;
    const isCorrect = guess === current.label;
    const newLabeled = labeled + 1;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    setLabeled(newLabeled);
    setCorrect(newCorrect);
    setFeedback(isCorrect);
    setAccuracy(newLabeled >= 2 ? Math.min(98, 45 + (newCorrect / newLabeled) * 50) : 0);
    if (newLabeled === 10) {
      recordGamePlay("train-robot", newCorrect);
      unlockAchievement("data-wizard");
    }
  }

  const next = useCallback(() => {
    setCurrentIdx(pickFromPool(currentIdx));
    setFeedback(null);
  }, [currentIdx]);

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-night-950/40 p-3 text-center">
          <p className="text-xs text-cloud-dim">Examples labeled</p>
          <p className="font-display text-2xl font-bold text-cloud">{labeled}</p>
        </div>
        <div className="rounded-2xl bg-night-950/40 p-3 text-center">
          <p className="text-xs text-cloud-dim">Correct</p>
          <p className="font-display text-2xl font-bold text-aurora-teal">{correct}</p>
        </div>
        <div className="rounded-2xl bg-night-950/40 p-3 text-center">
          <p className="text-xs text-cloud-dim">AI accuracy</p>
          <p className={cn("font-display text-2xl font-bold", acc >= 80 ? "text-aurora-teal" : acc >= 50 ? "text-aurora-amber" : "text-aurora-rose")}>
            {trained < 2 ? "\u2014" : `${Math.round(acc)}%`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-cloud-dim">Model confidence</span>
          <span className="font-semibold text-cloud-muted">{trained < 2 ? "Untrained" : acc >= 80 ? "Learning well!" : "Needs more data"}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className={cn("h-full rounded-full", acc >= 80 ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf" : acc >= 50 ? "bg-gradient-to-r from-aurora-amber to-aurora-rose" : "bg-aurora-rose/60")}
            animate={{ width: `${acc}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center rounded-3xl bg-night-950/40 p-8">
        <p className="mb-1 text-xs uppercase tracking-wider text-cloud-dim">What is this?</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="text-7xl"
          >
            {current.emoji}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {feedback !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("mt-4 rounded-2xl p-4 text-center text-sm", feedback ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}
          >
            {feedback ? "\u2705 Correct label! The model is learning." : "\u274C Wrong label! Bad data confuses the model."}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex gap-3">
        {feedback === null ? (
          <>
            <button
              onClick={() => label("cat")}
              className="flex-1 rounded-2xl bg-aurora-violet/10 px-4 py-3 font-display font-semibold text-aurora-violet ring-1 ring-aurora-violet/30 transition-all hover:bg-aurora-violet/20 active:scale-95"
            >
              Cat
            </button>
            <button
              onClick={() => label("dog")}
              className="flex-1 rounded-2xl bg-aurora-sky/10 px-4 py-3 font-display font-semibold text-aurora-sky ring-1 ring-aurora-sky/30 transition-all hover:bg-aurora-sky/20 active:scale-95"
            >
              Dog
            </button>
          </>
        ) : (
          <Button onClick={next} className="w-full">Next image</Button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-cloud-dim">
        The more examples you label, the smarter the robot gets. Feed it bad labels and watch the accuracy drop.
      </p>
    </div>
  );
}
