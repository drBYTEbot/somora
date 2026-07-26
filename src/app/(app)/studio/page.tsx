"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Icon } from "@/components/icons/icon";

interface AppIdea {
  keywords: string[];
  title: string;
  emoji: string;
  type: string;
  gradient: string;
  components: { name: string; desc: string }[];
  preview: "chatbot" | "story" | "classifier" | "game";
}

const ideas: AppIdea[] = [
  {
    keywords: ["chatbot", "tutor", "teach", "dinosaur", "dino"],
    title: "Dino Tutor Bot",
    emoji: "\u{1F996}",
    type: "AI Chatbot",
    gradient: "from-emerald-500 to-teal-600",
    components: [
      { name: "Chat Interface", desc: "A message window where the user types and the bot replies" },
      { name: "Knowledge Base", desc: "Facts about dinosaurs stored as data the AI can search" },
      { name: "Quiz Generator", desc: "After teaching, it asks a question to check understanding" },
      { name: "Personality", desc: "A friendly, curious tone that makes learning fun" },
    ],
    preview: "chatbot",
  },
  {
    keywords: ["story", "bedtime", "tale", "adventure"],
    title: "Bedtime Story Generator",
    emoji: "\u{1F4D6}",
    type: "Generative AI App",
    gradient: "from-fuchsia-500 to-purple-600",
    components: [
      { name: "Prompt Input", desc: "The user describes a character and setting" },
      { name: "Story Engine", desc: "An AI model generates a narrative from the prompt" },
      { name: "Illustration", desc: "An image model creates a picture for the story" },
      { name: "Save & Share", desc: "The story is saved to the child's portfolio" },
    ],
    preview: "story",
  },
  {
    keywords: ["classify", "classifier", "cat", "dog", "sort", "recycle"],
    title: "Smart Sorter",
    emoji: "\u{1F50E}",
    type: "Image Classifier",
    gradient: "from-sky-500 to-blue-600",
    components: [
      { name: "Image Input", desc: "A camera or upload button to capture an image" },
      { name: "Trained Model", desc: "A model the child trained by labeling examples" },
      { name: "Prediction", desc: "The model outputs a label and confidence score" },
      { name: "Feedback Loop", desc: "Wrong? Label it correctly and retrain" },
    ],
    preview: "classifier",
  },
  {
    keywords: ["game", "play", "robot", "recycling", "car"],
    title: "AI Mini-Game",
    emoji: "\u{1F3AE}",
    type: "AI-Powered Game",
    gradient: "from-amber-500 to-orange-600",
    components: [
      { name: "Game Loop", desc: "The core gameplay \u2014 move, collect, score" },
      { name: "AI Opponent", desc: "An agent that plays against or alongside the user" },
      { name: "Scoring", desc: "XP and rewards for correct behavior" },
      { name: "Levels", desc: "Difficulty increases as the player improves" },
    ],
    preview: "game",
  },
];

const presets = [
  "Make a chatbot that teaches dinosaurs",
  "Build a game where a robot sorts recycling",
  "Create an AI that tells bedtime stories",
  "Make a cat vs dog classifier",
];

function matchIdea(input: string): AppIdea {
  const lower = input.toLowerCase();
  for (const idea of ideas) {
    if (idea.keywords.some((k) => lower.includes(k))) return idea;
  }
  return ideas[0];
}

export default function StudioPage() {
  const [input, setInput] = useState("");
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState<AppIdea | null>(null);

  function build(text: string) {
    if (!text.trim()) return;
    setInput(text);
    setBuilding(true);
    setResult(null);
    setTimeout(() => {
      setResult(matchIdea(text));
      setBuilding(false);
    }, 1600);
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Studio"
        title="Vibe coding: describe it, build it"
        description="Tell Somora what you want to build in your own words. The AI interprets your idea, explains every piece, and generates a working app you can improve."
        center
      />

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-4xl glass-strong p-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && build(input)}
              placeholder="Make a chatbot that teaches dinosaurs..."
              className="flex-1 bg-transparent px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
            />
            <button
              onClick={() => build(input)}
              disabled={building || !input.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet px-6 py-3 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
            >
              {building ? "Building..." : "Build it"}
              {!building && <Icon name="sparkles" className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-cloud-dim">Try:</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => build(p)}
              className="rounded-full bg-white/5 px-3 py-1 text-xs text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {building && (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-4xl glass p-12 text-center"
            >
              <div className="mx-auto h-12 w-12 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
              <p className="mt-4 font-display text-lg text-cloud">Building your app...</p>
              <p className="mt-1 text-sm text-cloud-dim">Interpreting your idea, designing components, generating code</p>
            </motion.div>
          )}

          {result && !building && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={cn("relative overflow-hidden rounded-4xl glass-strong p-8")}>
                <div className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-25 blur-3xl", result.gradient)} />
                <div className="relative flex items-center gap-4">
                  <div className={cn("flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-glow-lg", result.gradient)}>
                    <span aria-hidden="true">{result.emoji}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-aurora-teal">{result.type}</p>
                    <h3 className="font-display text-2xl font-bold text-cloud">{result.title}</h3>
                  </div>
                </div>

                <div className="relative mt-6 rounded-3xl bg-night-950/50 p-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Live preview</p>
                  <AppPreview type={result.preview} emoji={result.emoji} />
                </div>
              </div>

              <div className="rounded-4xl glass p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-cloud-dim">What I built &amp; how it works</p>
                <div className="space-y-3">
                  {result.components.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 rounded-2xl bg-white/[0.03] p-4"
                    >
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-night-950", result.gradient)}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-cloud">{c.name}</p>
                        <p className="text-sm text-cloud-muted">{c.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-aurora-amber/10 p-4 text-sm text-aurora-amber">
                  <span className="font-semibold">Your turn:</span> This is your starting point. Modify the personality, add features, or train it with your own data to make it truly yours.
                </div>
              </div>
            </motion.div>
          )}

          {!result && !building && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-4xl glass p-12 text-center"
            >
              <div className="text-5xl opacity-30">{"\u{1F6E0}\u{FE0F}"}</div>
              <p className="mt-4 text-cloud-dim">Describe an app idea above and Somora will build it.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-16">
        <SectionHeader eyebrow="Progression" title="From blocks to real code" description="Studio grows with you. Start with natural language, unlock more power as you learn." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { level: "1", name: "Vibe Coding", desc: "Describe what you want in plain language", current: true },
            { level: "2", name: "Low-Code", desc: "Drag-and-drop blocks and workflows", current: false },
            { level: "3", name: "JavaScript", desc: "Write real code with AI help", current: false },
            { level: "4", name: "Python & APIs", desc: "Train models and deploy real apps", current: false },
          ].map((step) => (
            <div key={step.level} className={cn("rounded-3xl p-5", step.current ? "glass-strong ring-1 ring-aurora-teal/30" : "glass")}>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold", step.current ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/5 text-cloud-dim")}>
                {step.level}
              </div>
              <p className="mt-3 font-display font-semibold text-cloud">{step.name}</p>
              <p className="mt-1 text-xs text-cloud-muted">{step.desc}</p>
              {step.current && <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-aurora-teal">You are here</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppPreview({ type, emoji }: { type: AppIdea["preview"]; emoji: string }) {
  if (type === "chatbot") {
    return (
      <div className="space-y-2">
        <div className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-br-sm bg-aurora-violet/20 px-3 py-2 text-sm text-cloud">What&apos;s the biggest dinosaur?</div></div>
        <div className="flex justify-start"><div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2 text-sm text-cloud">{"Great question! The biggest dinosaur we know of is the Argentinosaurus. It was as long as 3 school buses! \u{1F996}"}</div></div>
        <div className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-br-sm bg-aurora-violet/20 px-3 py-2 text-sm text-cloud">Wow! Did it eat meat?</div></div>
      </div>
    );
  }
  if (type === "story") {
    return (
      <div className="rounded-2xl bg-white/[0.02] p-4">
        <div className="text-3xl">{emoji}</div>
        <p className="mt-2 font-display font-semibold text-cloud">The Brave Little Explorer</p>
        <p className="mt-1 text-sm text-cloud-muted">Once upon a time, a small {emoji} set out to find the Edge of the World. Along the way, it met a wise old owl who whispered a secret: the edge isn&apos;t a place, it&apos;s a question...</p>
      </div>
    );
  }
  if (type === "classifier") {
    return (
      <div className="flex items-center gap-4">
        <div className="text-4xl">{emoji}</div>
        <div className="flex-1">
          <div className="flex justify-between text-xs"><span className="text-cloud-dim">Confidence</span><span className="font-semibold text-aurora-teal">94%</span></div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5"><div className="h-full w-[94%] rounded-full bg-gradient-to-r from-aurora-teal to-aurora-leaf" /></div>
          <p className="mt-2 text-sm text-cloud">Prediction: Recyclable</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="text-3xl animate-float">{emoji}</div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => <div key={i} className="h-2 w-2 rounded-full bg-aurora-amber animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />)}
      </div>
      <span className="text-sm text-cloud-dim">Score: 0</span>
    </div>
  );
}
