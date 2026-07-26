"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { buildModel, generateDataset, trainModel, predictGrid, type TrainingMetrics } from "@/lib/ml";

export default function LabsPage() {
  const { addXP, unlockAchievement } = useStore();
  const [step, setStep] = useState(0);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [grid, setGrid] = useState<{ pred: number }[]>([]);
  const modelRef = useRef<{ dispose: () => void } | null>(null);

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  const cleanUp = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.dispose();
      modelRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanUp(), [cleanUp]);

  const configs = {
    easy: { samples: 80, epochs: 20, noise: 2, bias: 0, label: "Easy", emoji: "\u{1F525}", desc: "Clear patterns, lots of data" },
    medium: { samples: 50, epochs: 15, noise: 6, bias: 2, label: "Medium", emoji: "\u{1F4A7}", desc: "Some messy data" },
    hard: { samples: 30, epochs: 10, noise: 12, bias: 5, label: "Hard", emoji: "\u{1F525}\u{1F525}", desc: "Tricky, messy data" },
  };

  async function train() {
    setTraining(true);
    setMetrics([]);
    setAccuracy(0);
    setGrid([]);
    cleanUp();

    try {
      const cfg = configs[difficulty];
      const model = buildModel({ layers: [6, 4], learningRate: 0.03 });
      modelRef.current = model;
      const { xs, ys } = generateDataset(cfg.samples, cfg.noise, cfg.bias);

      await trainModel(model, xs, ys, cfg.epochs, (m) => {
        setMetrics((prev) => [...prev, m]);
        setAccuracy(m.accuracy);
      });

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
  const lastLoss = metrics.length > 0 ? metrics[metrics.length - 1].loss : 0;

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Labs"
        title="Teach a computer to think!"
        description="Train a real AI brain! Pick a difficulty, press the button, and watch the AI learn. It's like feeding a pet brain!"
        center
      />

      <div className="mx-auto mt-10 max-w-2xl">
        {/* Step 0: Pick difficulty */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-center font-display text-xl font-bold text-cloud">Pick your challenge!</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["easy", "medium", "hard"] as const).map((key) => {
                const cfg = configs[key];
                return (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={cn(
                      "rounded-4xl p-6 text-center transition-all active:scale-95",
                      difficulty === key ? "glass-strong ring-2 ring-aurora-violet/50" : "glass hover:bg-white/[0.06]",
                    )}
                  >
                    <div className="text-4xl">{cfg.emoji}</div>
                    <p className="mt-2 font-display text-lg font-bold text-cloud">{cfg.label}</p>
                    <p className="mt-1 text-xs text-cloud-muted">{cfg.desc}</p>
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
                animate={training ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={training ? { duration: 1, repeat: Infinity } : {}}
                className="text-7xl"
              >
                {"\u{1F9E0}"}
              </motion.div>
              <p className="mt-3 font-display text-lg font-bold text-cloud">
                {training ? "The brain is learning!" : "Ready to learn!"}
              </p>
              <p className="text-sm text-cloud-muted">
                {training ? `Thinking... ${metrics.length}/${configs[difficulty].epochs} lessons done` : `Difficulty: ${configs[difficulty].label}`}
              </p>
            </div>

            {/* Accuracy as a progress bar */}
            {(training || metrics.length > 0) && (
              <div className="rounded-3xl glass p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-cloud">How smart is it?</span>
                  <span className={cn("font-display text-2xl font-bold", acc >= 80 ? "text-aurora-teal" : acc >= 50 ? "text-aurora-amber" : "text-aurora-rose")}>
                    {acc}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={cn("h-full rounded-full", acc >= 80 ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf" : acc >= 50 ? "bg-gradient-to-r from-aurora-amber to-aurora-rose" : "bg-aurora-rose/60")}
                    animate={{ width: `${acc}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-cloud-dim">
                  {acc >= 80 ? "Amazing! The brain learned really well!" : acc >= 50 ? "Not bad! Feed it more data to improve." : "The brain is confused. Try easier data!"}
                </p>
              </div>
            )}

            {/* What the brain sees */}
            {grid.length > 0 && (
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

            {!training && metrics.length === 0 && (
              <Button onClick={train} className="w-full">
                Train the brain! {"\u26A1"}
              </Button>
            )}

            {training && (
              <div className="rounded-2xl bg-night-950/40 p-4 text-center text-sm text-cloud-muted">
                The AI brain is studying {configs[difficulty].samples} examples...
              </div>
            )}

            {!training && metrics.length > 0 && (
              <Button onClick={() => setStep(0)} variant="outline" className="w-full">
                Try a different difficulty
              </Button>
            )}
          </motion.div>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-4xl glass-strong p-8 text-center">
              <div className="text-7xl">{acc >= 80 ? "\u{1F3C6}" : acc >= 50 ? "\u{1F4AA}" : "\u{1F914}"}</div>
              <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
                {acc >= 80 ? "The brain is a genius!" : acc >= 50 ? "The brain is learning!" : "The brain needs more practice!"}
              </h3>
              <p className="mt-2 text-cloud-muted">
                It got <span className="font-bold text-aurora-teal">{acc}%</span> of answers right!
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
              <p className="mt-1">The AI brain looked at {configs[difficulty].samples} examples and learned to tell two things apart. You just trained a real AI!</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(0)} className="flex-1">Try again!</Button>
              <Button href="/academy" variant="outline" className="flex-1">Learn more</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
