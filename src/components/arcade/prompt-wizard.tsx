"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { promptChallenges } from "@/config/prompts";
import { useStore } from "@/lib/store";

export function PromptWizard() {
  const { recordGamePlay, unlockAchievement } = useStore();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<null | "A" | "B">(null);
  const [finished, setFinished] = useState(false);
  const recordedRef = useRef(false);

  const challenge = promptChallenges[index];

  function choose(pick: "A" | "B") {
    if (chosen) return;
    setChosen(pick);
    if (pick === challenge.correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= promptChallenges.length) {
      if (!recordedRef.current) {
        recordedRef.current = true;
        recordGamePlay("prompt-wizard", score);
        if (score >= 2) unlockAchievement("prompt-pro");
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
  }

  function restart() {
    recordedRef.current = false;
    setIndex(0);
    setScore(0);
    setChosen(null);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-4xl glass-strong p-10 text-center">
        <p className="text-5xl">{score >= 2 ? "\u{1F9D9}" : "\u2728"}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
          {score >= 2 ? "You're a Prompt Wizard!" : "Keep practicing your spells!"}
        </h3>
        <p className="mt-2 text-cloud-muted">
          You scored <span className="font-bold text-aurora-bloom">{score}</span> out of {promptChallenges.length}.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-cloud-dim">
          The way you talk to AI changes everything it creates. Every great AI builder is first a great prompt engineer.
        </p>
        <Button onClick={restart} className="mt-6">Play again</Button>
      </div>
    );
  }

  const isCorrect = chosen === challenge.correct;

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-aurora-bloom/15 px-3 py-1 text-xs font-semibold text-aurora-bloom">
          Challenge {index + 1} / {promptChallenges.length}
        </span>
        <span className="text-xs text-cloud-dim">Score: {score}</span>
      </div>

      <div className="mb-5 rounded-3xl bg-night-950/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Scenario</p>
        <p className="mt-1 text-cloud">{challenge.scenario}</p>
      </div>

      <p className="mb-3 text-center text-sm text-cloud-muted">Which prompt produces the better result?</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {(["A", "B"] as const).map((opt) => {
          const isThis = chosen === opt;
          const isWinner = challenge.correct === opt;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={chosen !== null}
              className={cn(
                "rounded-3xl border p-5 text-left transition-all duration-200",
                chosen === null && "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                isThis && isWinner && "border-aurora-teal/50 bg-aurora-teal/10",
                isThis && !isWinner && "border-aurora-rose/50 bg-aurora-rose/10",
                chosen !== null && !isThis && isWinner && "border-aurora-teal/40 bg-aurora-teal/5",
                chosen !== null && !isThis && !isWinner && "opacity-50",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-bold text-cloud-dim">Prompt {opt}</span>
                {chosen && isWinner && <span className="text-xs font-semibold text-aurora-teal">Best</span>}
                {isThis && !isWinner && <span className="text-xs font-semibold text-aurora-rose">Not quite</span>}
              </div>
              <p className="font-mono text-xs text-cloud-muted">&ldquo;{opt === "A" ? challenge.promptA : challenge.promptB}&rdquo;</p>
              {chosen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 border-t border-white/5 pt-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cloud-dim">Result</p>
                  <p className="mt-1 whitespace-pre-line text-xs text-cloud">{opt === "A" ? challenge.resultA : challenge.resultB}</p>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("mt-4 rounded-2xl p-4 text-sm", isCorrect ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}
          >
            <p className="font-semibold">{isCorrect ? "Excellent choice!" : "Close, but not the best one."}</p>
            <p className="mt-1 text-cloud-muted">{challenge.principle}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {chosen && (
        <Button onClick={next} className="mt-5 w-full">
          {index + 1 >= promptChallenges.length ? "See results" : "Next challenge"}
        </Button>
      )}
    </div>
  );
}
