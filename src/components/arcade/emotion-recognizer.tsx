"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Face {
  emoji: string;
  emotion: string;
}

const faces: Face[] = [
  { emoji: "\u{1F600}", emotion: "Happy" },
  { emoji: "\u{1F622}", emotion: "Sad" },
  { emoji: "\u{1F621}", emotion: "Angry" },
  { emoji: "\u{1F631}", emotion: "Scared" },
  { emoji: "\u{1F92D}", emotion: "Shy" },
  { emoji: "\u{1F970}", emotion: "Loved" },
  { emoji: "\u{1F634}", emotion: "Sleepy" },
  { emoji: "\u{1F929}", emotion: "Excited" },
];

const emotions = ["Happy", "Sad", "Angry", "Scared"];

const rounds: Face[] = [
  { emoji: "\u{1F600}", emotion: "Happy" },
  { emoji: "\u{1F622}", emotion: "Sad" },
  { emoji: "\u{1F621}", emotion: "Angry" },
  { emoji: "\u{1F631}", emotion: "Scared" },
  { emoji: "\u{1F929}", emotion: "Excited" },
  { emoji: "\u{1F634}", emotion: "Sleepy" },
  { emoji: "\u{1F970}", emotion: "Loved" },
  { emoji: "\u{1F92D}", emotion: "Shy" },
];

export function EmotionRecognizer() {
  const { recordGamePlay } = useStore();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = rounds[index];

  function guess(emotion: string) {
    if (answered) return;
    const correct = emotion === current.emotion;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct);
    setAnswered(true);
  }

  function next() {
    if (index + 1 >= rounds.length) {
      recordGamePlay("emotion-recognizer", score);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFeedback(null);
    setAnswered(false);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setAnswered(false);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-4xl glass-strong p-10 text-center">
        <p className="text-5xl">{score >= 6 ? "\u{1F9E0}" : "\u{1F443}"}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
          {score >= 6 ? "Emotion expert!" : "Keep practicing!"}
        </h3>
        <p className="mt-2 text-cloud-muted">You recognized <span className="font-bold text-aurora-teal">{score}</span> out of {rounds.length} emotions.</p>
        <Button onClick={restart} className="mt-6">Play again</Button>
      </div>
    );
  }

  const options = [...new Set([...emotions, current.emotion])].sort(() => Math.random() - 0.5).slice(0, 4);
  if (!options.includes(current.emotion)) options[0] = current.emotion;

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-aurora-violet/15 px-3 py-1 text-xs font-semibold text-aurora-violet">
          Face {index + 1} / {rounds.length}
        </span>
        <span className="text-xs text-cloud-dim">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center rounded-3xl bg-night-950/40 py-8"
        >
          <div className="text-8xl">{current.emoji}</div>
          <p className="mt-2 text-xs text-cloud-dim">What emotion is this face showing?</p>
        </motion.div>
      </AnimatePresence>

      {feedback !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-4 rounded-2xl p-4 text-center text-sm", feedback ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}>
          {feedback ? "\u2705 Correct!" : `\u274C The answer was: ${current.emotion}`}
        </motion.div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {answered ? (
          <Button onClick={next} className="col-span-2">
            {index + 1 >= rounds.length ? "See results" : "Next face"}
          </Button>
        ) : (
          options.map((opt) => (
            <button
              key={opt}
              onClick={() => guess(opt)}
              className="rounded-2xl bg-white/5 px-4 py-3 font-display text-sm font-semibold text-cloud ring-1 ring-white/10 transition-all hover:bg-white/10 active:scale-95"
            >
              {opt}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
