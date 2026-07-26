"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Message {
  text: string;
  spam: boolean;
}

const messages: Message[] = [
  { text: "Hey! Want to play Roblox later?", spam: false },
  { text: "CONGRATULATIONS! You won $1,000,000! Click NOW!!!", spam: true },
  { text: "Mom said dinner is ready at 6", spam: false },
  { text: "FREE V-BUCKS! Limited time offer! Click here!", spam: true },
  { text: "Can you help me with the math homework?", spam: false },
  { text: "URGENT: Your account will be deleted! Verify NOW!", spam: true },
  { text: "The new Avengers movie is so good!", spam: false },
  { text: "Make $5000/day from home! No experience needed!", spam: true },
  { text: "Did you finish the science project?", spam: false },
  { text: "You've been selected for a free iPhone! Claim today!", spam: true },
];

export function SpamDetective() {
  const { recordGamePlay, unlockAchievement } = useStore();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const current = messages[index];

  function choose(spam: boolean) {
    if (answered) return;
    const correct = spam === current.spam;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct);
    setAnswered(true);
  }

  function next() {
    if (index + 1 >= messages.length) {
      recordGamePlay("spam-detective", score);
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
    setFinished(false);
    setAnswered(false);
  }

  if (finished) {
    return (
      <div className="rounded-4xl glass-strong p-10 text-center">
        <p className="text-5xl">{score >= 7 ? "\u{1F575}\u{FE0F}" : "\u{1F4E7}"}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
          {score >= 7 ? "Case closed, Detective!" : "Keep investigating!"}
        </h3>
        <p className="mt-2 text-cloud-muted">You caught <span className="font-bold text-aurora-teal">{score}</span> out of {messages.length} correctly.</p>
        <Button onClick={restart} className="mt-6">Play again</Button>
      </div>
    );
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">
          Message {index + 1} / {messages.length}
        </span>
        <span className="text-xs text-cloud-dim">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-3xl bg-night-950/40 p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl">
              {"\u{1F4E7}"}
            </div>
            <div>
              <p className="text-xs text-cloud-dim">From: unknown@sender.com</p>
              <p className="mt-1 text-cloud">{current.text}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {feedback !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("mt-4 rounded-2xl p-4 text-sm", feedback ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}
        >
          {feedback ? "\u2705 Correct!" : `\u274C Wrong! This was ${current.spam ? "SPAM" : "a real message"}.`}
          {!feedback && current.spam && " Look for: ALL CAPS, urgent language, too-good-to-be-be offers, requests to click links."}
        </motion.div>
      )}

      <div className="mt-5 flex gap-3">
        {answered ? (
          <Button onClick={next} className="w-full">
            {index + 1 >= messages.length ? "See results" : "Next message"}
          </Button>
        ) : (
          <>
            <button onClick={() => choose(false)} className="flex-1 rounded-2xl bg-aurora-teal/10 px-4 py-3 font-display font-semibold text-aurora-teal ring-1 ring-aurora-teal/30 transition-all hover:bg-aurora-teal/20 active:scale-95">
              {"\u2705"} Real
            </button>
            <button onClick={() => choose(true)} className="flex-1 rounded-2xl bg-aurora-rose/10 px-4 py-3 font-display font-semibold text-aurora-rose ring-1 ring-aurora-rose/30 transition-all hover:bg-aurora-rose/20 active:scale-95">
              {"\u{1F6AB}"} Spam
            </button>
          </>
        )}
      </div>
    </div>
  );
}
