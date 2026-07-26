"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Example {
  emoji: string;
  text: string;
  good: boolean;
  reason: string;
}

const examples: Example[] = [
  { emoji: "\u{1F415}", text: "1,000 photos of cats, all breeds, all lighting", good: true, reason: "Great dataset \u2014 diverse examples help the AI generalize." },
  { emoji: "\u{1F436}", text: "500 dog photos, but all taken outdoors in summer", good: false, reason: "Skewed! The AI won't recognize dogs indoors or in winter." },
  { emoji: "\u{1F431}", text: "Cat photos labeled by three different people who agreed", good: true, reason: "Consistent, agreed-upon labels reduce confusion." },
  { emoji: "\u{1F434}", text: "Horse photos, but 90% of them are brown horses", good: false, reason: "Imbalanced data \u2014 the AI will struggle with other colors." },
  { emoji: "\u{1F984}", text: "Rabbit photos, all the same rabbit from one angle", good: false, reason: "No variety! The AI memorizes one rabbit instead of learning 'rabbit'." },
  { emoji: "\u{1F429}", text: "2,000 bird photos, many species, clear labels", good: true, reason: "Excellent \u2014 large, varied, and well-labeled." },
  { emoji: "\u{1F408}", text: "Photos labeled 'cat' that include tigers and lions", good: false, reason: "Ambiguous labels. Is a tiger a cat? Define your categories clearly." },
  { emoji: "\u{1F417}", text: "Animal photos where some labels are just blank", good: false, reason: "Missing labels = the AI can't learn from those examples." },
];

export function DataDetective() {
  const { recordGamePlay, unlockAchievement } = useStore();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | { correct: boolean; reason: string }>(null);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const recordedRef = useRef(false);

  const current = examples[index];

  function answer(good: boolean) {
    if (answered) return;
    const correct = good === current.good;
    if (correct) setScore((s) => s + 1);
    setFeedback({ correct, reason: current.reason });
    setAnswered(true);
  }

  function next() {
    if (index + 1 >= examples.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        recordGamePlay("data-detective", score);
        if (score >= 6) unlockAchievement("data-wizard");
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFeedback(null);
    setAnswered(false);
  }

  function restart() {
    recordedRef.current = false;
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
    setAnswered(false);
  }

  if (finished) {
    return (
      <div className="rounded-4xl glass-strong p-10 text-center">
        <p className="text-5xl">{score >= 6 ? "\u{1F3C6}" : "\u{1F50E}"}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
          {score >= 6 ? "Case closed, Detective!" : "Keep investigating!"}
        </h3>
        <p className="mt-2 text-cloud-muted">
          You scored <span className="font-bold text-aurora-teal">{score}</span> out of {examples.length}.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-cloud-dim">
          {score >= 6
            ? "You've got a sharp eye for good data. Datasets are the foundation of every AI \u2014 and you just proved you know what makes them great."
            : "Datasets decide everything an AI knows. Play again to sharpen your eye for good vs bad training data."}
        </p>
        <Button onClick={restart} className="mt-6">Play again</Button>
      </div>
    );
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-aurora-teal/15 px-3 py-1 text-xs font-semibold text-aurora-teal">
            {index + 1} / {examples.length}
          </span>
          <span className="text-xs text-cloud-dim">Score: {score}</span>
        </div>
        <span className="text-xs uppercase tracking-wider text-cloud-dim">Good data or bad data?</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-night-950/40 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{current.emoji}</span>
            <div>
              <p className="font-display text-lg font-semibold text-cloud">Dataset sample</p>
              <p className="mt-1 text-cloud-muted">{current.text}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 rounded-2xl p-4 text-sm",
              feedback.correct ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose",
            )}
          >
            <p className="font-semibold">
              {feedback.correct ? "Correct!" : "Not quite \u2014"} {feedback.reason}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex gap-3">
        {!answered ? (
          <>
            <button
              onClick={() => answer(false)}
              className="flex-1 rounded-2xl bg-aurora-rose/10 px-4 py-3 font-display font-semibold text-aurora-rose ring-1 ring-aurora-rose/30 transition-all hover:bg-aurora-rose/20 active:scale-95"
            >
              Bad data
            </button>
            <button
              onClick={() => answer(true)}
              className="flex-1 rounded-2xl bg-aurora-teal/10 px-4 py-3 font-display font-semibold text-aurora-teal ring-1 ring-aurora-teal/30 transition-all hover:bg-aurora-teal/20 active:scale-95"
            >
              Good data
            </button>
          </>
        ) : (
          <Button onClick={next} className="w-full">
            {index + 1 >= examples.length ? "See results" : "Next case"}
          </Button>
        )}
      </div>
    </div>
  );
}
