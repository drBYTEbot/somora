"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { buildModel, generateDataset, trainOneEpoch, predictGrid } from "@/lib/ml";

type Diff = "easy" | "medium" | "hard";

const configs: Record<Diff, {
  samples: number;
  epochs: number;
  noise: number;
  bias: number;
  separation: number;
  label: string;
  emoji: string;
  desc: string;
  expected: string;
}> = {
  easy: {
    samples: 60,
    epochs: 12,
    noise: 3,
    bias: 0,
    separation: 3.5,
    label: "Easy",
    emoji: "\u{1F525}",
    desc: "Clear patterns. The brain should get really smart!",
    expected: "90-100%",
  },
  medium: {
    samples: 40,
    epochs: 10,
    noise: 8,
    bias: 1,
    separation: 2,
    label: "Medium",
    emoji: "\u{1F4A7}",
    desc: "Some messy data. Can the brain figure it out?",
    expected: "70-85%",
  },
  hard: {
    samples: 25,
    epochs: 8,
    noise: 14,
    bias: 3,
    separation: 1.2,
    label: "Hard",
    emoji: "\u{1F525}\u{1F525}",
    desc: "Really messy! The brain will struggle!",
    expected: "55-70%",
  },
};

export default function LabsPage() {
  const { addXP, unlockAchievement } = useStore();
  const [step, setStep] = useState(0);
  const [difficulty, setDifficulty] = useState<Diff>("easy");
  const [training, setTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [grid, setGrid] = useState<{ pred: number }[]>([]);
  const modelRef = useRef<{ dispose: () => void } | null>(null);

  const cleanUp = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.dispose();
      modelRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanUp(), [cleanUp]);

  async function train() {
    const cfg = configs[difficulty];
    setTraining(true);
    setCurrentEpoch(0);
    setAccuracy(0);
    setGrid([]);
    cleanUp();

    try {
      const model = buildModel({ layers: [6, 4], learningRate: 0.03 });
      modelRef.current = model;
      const { xs, ys } = generateDataset(cfg.samples, cfg.noise, cfg.bias, cfg.separation);

      // Train one epoch at a time with a delay so the user can SEE it learning
      for (let i = 0; i < cfg.epochs; i++) {
        const metrics = await trainOneEpoch(model, xs, ys);
        setCurrentEpoch(metrics.epoch);
        setAccuracy(metrics.accuracy);
        // Small delay so the UI can update and the user sees progress
        await new Promise((r) => setTimeout(r, 250));
      }

      const preds = predictGrid(model, 12);
      setGrid(preds);
      addXP(40);
      unlockAchievement("data-wizard");
      xs.dispose();
      ys.dispose();
    } catch {
      // ignore
    } finally {
      setTraining(false);
      setStep(2);
    }
  }

  const acc = Math.round(accuracy * 100);
  const cfg = configs[difficulty];

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Labs"
        title="Teach a computer to think!"
        description="Train a real AI brain! Pick a challenge, press the button, and watch the brain learn step by step!"
        center
      />

      <div className="mx-auto mt-10 max-w-2xl">
        {/* Step 0: Pick difficulty */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-center font-display text-xl font-bold text-cloud">Pick your challenge!</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["easy", "medium", "hard"] as const).map((key) => {
                const c = configs[key];
                return (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={cn(
                      "rounded-4xl p-6 text-center transition-all active:scale-95",
                      difficulty === key ? "glass-strong ring-2 ring-aurora-violet/50" : "glass hover:bg-white/[0.06]",
                    )}
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <p className="mt-2 font-display text-lg font-bold text-cloud">{c.label}</p>
                    <p className="mt-1 text-xs text-cloud-muted">{c.desc}</p>
                    <p className="mt-2 text-[10px] text-cloud-dim">Goal: {c.expected} accuracy</p>
                  </button>
                );
              })}
            </div>
            <Button onClick={() => setStep(1)} className="w-full">
              Let&apos;s train! {"\u{1F9E0}"}
            </Button>
          </motion.div>
        )}

        {/* Step 1: Training */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* The AI Brain */}
            <div className="rounded-4xl glass-strong p-8 text-center">
              <motion.div
                animate={training ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={training ? { duration: 0.5, repeat: Infinity } : {}}
                className="text-7xl"
              >
                {"\u{1F9E0}"}
              </motion.div>
              <p className="mt-3 font-display text-lg font-bold text-cloud">
                {training ? "The brain is learning!" : "Ready to learn!"}
              </p>
              {!training && currentEpoch === 0 && (
                <p className="text-sm text-cloud-muted">Difficulty: {cfg.label} {"\u00B7"} {cfg.desc}</p>
              )}
              {training && (
                <p className="text-sm text-cloud-muted">
                  Lesson {currentEpoch} of {cfg.epochs} done...
                </p>
              )}
            </div>

            {/* Accuracy as a progress bar */}
            {(training || currentEpoch > 0) && (
              <div className="rounded-3xl glass p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-cloud">
                    {training ? "Getting smarter..." : "How smart is it?"}
                  </span>
                  <span className={cn("font-display text-3xl font-bold transition-all", acc >= 80 ? "text-aurora-teal" : acc >= 50 ? "text-aurora-amber" : "text-aurora-rose")}>
                    {acc}%
                  </span>
                </div>
                <div className="h-5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={cn("h-full rounded-full transition-all duration-300", acc >= 80 ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf" : acc >= 50 ? "bg-gradient-to-r from-aurora-amber to-aurora-rose" : "bg-aurora-rose/60")}
                    animate={{ width: `${acc}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Epoch dots */}
                <div className="mt-3 flex justify-center gap-1.5">
                  {Array.from({ length: cfg.epochs }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i < currentEpoch ? "w-4 bg-aurora-violet" : i === currentEpoch && training ? "w-4 bg-aurora-violet/50 animate-pulse" : "w-2 bg-white/10",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-cloud-dim">
                  {training
                    ? currentEpoch < cfg.epochs
                      ? `Studying lesson ${currentEpoch + 1}...`
                      : "Finishing up..."
                    : acc >= 80
                      ? "Amazing! The brain learned really well!"
                      : acc >= 50
                        ? "Not bad! The brain learned something!"
                        : "Oops! The brain is confused. Try easier data!"}
                </p>
              </div>
            )}

            {/* Show what the brain sees during training (updates live) */}
            {(training || grid.length > 0) && grid.length > 0 && (
              <div className="rounded-3xl glass p-6">
                <p className="mb-3 text-sm font-semibold text-cloud">What the brain learned to see:</p>
                <div className="grid gap-px overflow-hidden rounded-2xl" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
                  {grid.map((cell, i) => (
                    <div key={i} className="aspect-square" style={{ backgroundColor: `rgba(${cell.pred > 0.5 ? "45, 212, 191" : "167, 139, 250"}, ${cell.pred > 0.5 ? cell.pred : 1 - cell.pred})` }} />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-cloud-dim">
                  <span>{"\u{1F7E3}"} Purple = one thing</span>
                  <span>{"\u{1F7E2}"} Green = another thing</span>
                </div>
              </div>
            )}

            {/* Start button */}
            {!training && currentEpoch === 0 && (
              <Button onClick={train} className="w-full">
                Train the brain! {"\u26A1"}
              </Button>
            )}

            {/* Training message */}
            {training && (
              <div className="rounded-2xl bg-night-950/40 p-4 text-center text-sm text-cloud-muted">
                The AI brain is studying {cfg.samples} examples... watch the percentage go up!
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-4xl glass-strong p-8 text-center">
              <div className="text-7xl">{acc >= 80 ? "\u{1F3C6}" : acc >= 50 ? "\u{1F4AA}" : "\u{1F914}"}</div>
              <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
                {acc >= 80 ? "The brain is a genius!" : acc >= 50 ? "The brain learned something!" : "The brain is confused!"}
              </h3>
              <p className="mt-2 text-cloud-muted">
                It got <span className="font-bold text-aurora-teal">{acc}%</span> of answers right!
              </p>
              <p className="mt-1 text-xs text-cloud-dim">
                {cfg.label} difficulty {"\u00B7"} {cfg.samples} examples {"\u00B7"} {cfg.epochs} lessons
              </p>

              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-cloud">What it learned to see:</p>
                <div className="grid gap-px overflow-hidden rounded-2xl" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
                  {grid.map((cell, i) => (
                    <div key={i} className="aspect-square" style={{ backgroundColor: `rgba(${cell.pred > 0.5 ? "45, 212, 191" : "167, 139, 250"}, ${cell.pred > 0.5 ? cell.pred : 1 - cell.pred})` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl glass p-5 text-sm text-cloud-muted">
              <p className="font-semibold text-cloud">What happened?</p>
              <p className="mt-1">
                The AI brain looked at {cfg.samples} examples and learned to tell two things apart.
                {" "}{acc >= 80
                  ? "The data was nice and clear, so the brain got really smart!"
                  : acc >= 50
                    ? "The data was a bit messy, but the brain figured out most of it!"
                    : "The data was too messy! The brain couldn't tell the difference. Try easier data!"}
                {" "}You just trained a real AI! {"\u{1F9E0}"}
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => { setStep(0); setCurrentEpoch(0); setAccuracy(0); setGrid([]); }} className="flex-1">Try again!</Button>
              <Button href="/academy" variant="outline" className="flex-1">Learn more</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
