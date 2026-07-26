"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { VibeCoding } from "./vibe-coding";
import { BlockCoding } from "./block-coding";
import { JSEditor } from "./js-editor";
import { PythonLab } from "./python-lab";

type Mode = "vibe" | "blocks" | "js" | "python";

const MODES: { id: Mode; level: string; name: string; emoji: string; desc: string }[] = [
  { id: "vibe", level: "1", name: "Vibe Coding", emoji: "\u2728", desc: "Describe it in plain English, AI builds it" },
  { id: "blocks", level: "2", name: "Block Coding", emoji: "\u{1F9E9}", desc: "Drag-and-drop blocks to build apps" },
  { id: "js", level: "3", name: "JavaScript", emoji: "\u{1F4BB}", desc: "Write real code with AI help" },
  { id: "python", level: "4", name: "Python & AI", emoji: "\u{1F40D}", desc: "Train models and analyze data" },
];

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("vibe");

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Studio"
        title="Build real apps, your way"
        description="Four ways to create, from describing your idea to writing real Python. Level up as you learn!"
        center
      />

      {/* Mode selector */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "relative rounded-3xl p-4 text-left transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet/50",
                mode === m.id ? "glass-strong ring-2 ring-aurora-violet/40" : "glass hover:bg-white/[0.06]",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold",
                    mode === m.id
                      ? "bg-gradient-to-br from-aurora-teal/20 to-aurora-violet/20 text-cloud"
                      : "bg-white/5 text-cloud-dim",
                  )}
                >
                  {m.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-cloud-dim">L{m.level}</span>
                    <p className={cn("text-sm font-bold", mode === m.id ? "text-cloud" : "text-cloud-muted")}>
                      {m.name}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-tight text-cloud-dim">{m.desc}</p>
                </div>
              </div>
              {mode === m.id && (
                <motion.div
                  layoutId="active-mode"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mode content */}
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
