"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VibeCoding } from "./vibe-coding";
import { BlockCoding } from "./block-coding";
import { JSEditor } from "./js-editor";
import { PythonLab } from "./python-lab";

type Mode = "vibe" | "blocks" | "js" | "python";

const MODES: { id: Mode; emoji: string; name: string; hint: string }[] = [
  { id: "vibe", emoji: "\u2728", name: "Magic Words", hint: "Tell AI what to build" },
  { id: "blocks", emoji: "\u{1F9E9}", name: "Blocks", hint: "Drag blocks to build" },
  { id: "js", emoji: "\u{1F4BB}", name: "Code", hint: "Write real code" },
  { id: "python", emoji: "\u{1F40D}", name: "Python", hint: "Make AI with Python" },
];

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("vibe");
  const current = MODES.find((m) => m.id === mode)!;

  return (
    <div className="container-page py-8 lg:py-10">
      <h1 className="text-center font-display text-3xl font-bold text-cloud sm:text-4xl">
        Let&apos;s build something! {"\u{1F680}"}
      </h1>
      <p className="mt-2 text-center text-cloud-muted">
        Pick how you want to build today
      </p>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-3xl p-5 text-center transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet/50",
              mode === m.id
                ? "glass-strong ring-2 ring-aurora-violet/40"
                : "glass hover:bg-white/[0.06]",
            )}
          >
            <span className="text-4xl" aria-hidden="true">{m.emoji}</span>
            <span className={cn("font-display text-base font-bold", mode === m.id ? "text-cloud" : "text-cloud-muted")}>
              {m.name}
            </span>
            <span className="text-[11px] text-cloud-dim">{m.hint}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "vibe" && <VibeCoding />}
            {mode === "blocks" && <BlockCoding />}
            {mode === "js" && <JSEditor />}
            {mode === "python" && <PythonLab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
