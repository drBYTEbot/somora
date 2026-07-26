"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Dataset {
  emoji: string;
  label: string;
  group: string;
}

const allData: Dataset[] = [
  { emoji: "\u{1F468}\u{1F3FB}", label: "Person A", group: "light" },
  { emoji: "\u{1F468}\u{1F3FB}", label: "Person B", group: "light" },
  { emoji: "\u{1F468}\u{1F3FB}", label: "Person C", group: "light" },
  { emoji: "\u{1F468}\u{1F3FB}", label: "Person D", group: "light" },
  { emoji: "\u{1F468}\u{1F3FE}", label: "Person E", group: "dark" },
  { emoji: "\u{1F468}\u{1F3FE}", label: "Person F", group: "dark" },
  { emoji: "\u{1F469}\u{1F3FB}", label: "Person G", group: "light" },
  { emoji: "\u{1F469}\u{1F3FE}", label: "Person H", group: "dark" },
];

export function BiasDetective() {
  const { recordGamePlay, addXP } = useStore();
  const [selected, setSelected] = useState<Dataset[]>([]);
  const [phase, setPhase] = useState<"collect" | "analyze" | "fix" | "done">("collect");

  const lightCount = selected.filter((d) => d.group === "light").length;
  const darkCount = selected.filter((d) => d.group === "dark").length;
  const isBiased = phase === "analyze" && Math.abs(lightCount - darkCount) >= 3;

  function toggle(item: Dataset) {
    if (phase !== "collect") return;
    setSelected((prev) => {
      const exists = prev.find((p) => p.label === item.label);
      if (exists) return prev.filter((p) => p.label !== item.label);
      if (prev.length >= 6) return prev;
      return [...prev, item];
    });
  }

  function analyze() {
    if (selected.length < 4) return;
    setPhase("analyze");
  }

  function fixBias() {
    setPhase("fix");
  }

  function rebalance() {
    setSelected(allData.slice(0, 6));
    setPhase("done");
    recordGamePlay("bias-detective", 100);
    addXP(40);
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <h3 className="font-display text-xl font-bold text-cloud">Bias Detective</h3>
      <p className="mt-1 text-sm text-cloud-muted">
        {phase === "collect" && "Pick 4-6 photos to train your face AI. Choose wisely!"}
        {phase === "analyze" && "Let's see what your AI learned. Is it fair?"}
        {phase === "fix" && "Your AI is biased! Add more diverse photos to fix it."}
        {phase === "done" && "Fixed! Now your AI can recognize everyone fairly."}
      </p>

      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {allData.map((item) => {
          const isSelected = selected.some((s) => s.label === item.label);
          return (
            <button
              key={item.label}
              onClick={() => toggle(item)}
              disabled={phase !== "collect" && phase !== "fix"}
              className={cn(
                "flex flex-col items-center rounded-2xl p-2 transition-all",
                isSelected ? "bg-aurora-teal/15 ring-1 ring-aurora-teal/40" : "bg-white/[0.03] hover:bg-white/[0.06]",
                phase !== "collect" && phase !== "fix" && "cursor-default",
              )}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="mt-1 text-[9px] text-cloud-dim">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-night-950/40 p-4">
        <div className="flex gap-4 text-sm">
          <span className="text-cloud">Selected: {selected.length}</span>
          {phase !== "collect" && (
            <>
              <span className="text-aurora-amber">Light skin: {lightCount}</span>
              <span className="text-aurora-violet">Dark skin: {darkCount}</span>
            </>
          )}
        </div>
      </div>

      {phase === "analyze" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-4 rounded-2xl p-4", isBiased ? "bg-aurora-rose/10" : "bg-aurora-teal/10")}>
          {isBiased ? (
            <>
              <p className="font-semibold text-aurora-rose">{"\u26A0\u{FE0F}"} Bias detected!</p>
              <p className="mt-1 text-sm text-cloud-muted">Your AI saw {lightCount} light-skinned and {darkCount} dark-skinned faces. It will be worse at recognizing dark skin because it didn&apos;t see enough examples!</p>
              <Button onClick={fixBias} className="mt-3 w-full">Fix the bias</Button>
            </>
          ) : (
            <>
              <p className="font-semibold text-aurora-teal">{"\u2705"} Fair dataset!</p>
              <p className="mt-1 text-sm text-cloud-muted">Your AI saw a balanced mix of people. It will work fairly for everyone!</p>
              <Button onClick={() => { recordGamePlay("bias-detective", 100); addXP(40); setPhase("done"); }} className="mt-3 w-full">Complete!</Button>
            </>
          )}
        </motion.div>
      )}

      {phase === "fix" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-aurora-amber/10 p-4 text-sm text-aurora-amber">
          <p className="font-semibold">Fix the imbalance!</p>
          <p className="mt-1 text-cloud-muted">Click more dark-skinned photos above to balance your dataset. Then press the button below.</p>
          <Button onClick={rebalance} className="mt-3 w-full">Rebalance dataset</Button>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl bg-aurora-teal/10 p-6 text-center">
          <p className="text-4xl">{"\u{1F3C6}"}</p>
          <p className="mt-2 font-display font-semibold text-aurora-teal">You fixed the bias!</p>
          <p className="mt-1 text-sm text-cloud-muted">Your AI now has a fair, balanced dataset. It will work for everyone!</p>
        </motion.div>
      )}

      {phase === "collect" && (
        <Button onClick={analyze} disabled={selected.length < 4} className="mt-4 w-full">
          Train AI ({selected.length}/4 minimum)
        </Button>
      )}
    </div>
  );
}
