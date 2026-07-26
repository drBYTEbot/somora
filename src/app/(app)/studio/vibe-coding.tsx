"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import {
  generateApp,
  isAIReady,
  loadPuter,
  encodeAppForSharing,
  type StudioResult,
} from "@/lib/ai";

const presets = [
  "Make a chatbot that teaches dinosaurs",
  "Build a game where a robot sorts recycling",
  "Create an AI that tells bedtime stories",
  "Make a cat vs dog classifier",
];

export function VibeCoding() {
  const { createProject, addXP } = useStore();
  const [input, setInput] = useState("");
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPuter().then(() => {
      const check = setInterval(() => {
        if (isAIReady()) {
          setAiReady(true);
          clearInterval(check);
        }
      }, 500);
      const timeout = setTimeout(() => clearInterval(check), 15000);
      return () => {
        clearInterval(check);
        clearTimeout(timeout);
      };
    });
  }, []);

  async function build(text: string) {
    if (!text.trim() || building) return;
    setInput(text);
    setBuilding(true);
    setResult(null);
    setError(null);
    setSaved(false);
    setShareUrl(null);
    setCopied(false);

    try {
      const generated = await generateApp(text);
      setResult(generated);
      const sharePath = encodeAppForSharing(generated.html);
      if (sharePath) {
        setShareUrl(`${window.location.origin}${sharePath}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBuilding(false);
    }
  }

  function saveProject() {
    if (!result || saved) return;
    createProject({
      title: result.title,
      emoji: result.emoji,
      description: result.description,
      type: result.type,
      prompt: input,
      tags: result.tags,
      html: result.html,
    });
    addXP(50);
    setSaved(true);
  }

  function copyLink() {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const gradientForType: Record<string, string> = {
    chatbot: "from-emerald-500 to-teal-600",
    classifier: "from-sky-500 to-blue-600",
    story: "from-fuchsia-500 to-purple-600",
    game: "from-amber-500 to-orange-600",
    tool: "from-violet-500 to-indigo-600",
    art: "from-pink-500 to-rose-600",
  };
  const gradient =
    gradientForType[result?.type ?? "tool"] ?? "from-aurora-teal to-aurora-violet";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl">
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

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {building && (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <div className="flex min-h-[400px] items-center justify-center rounded-4xl glass p-12 text-center">
                <div>
                  <div className="mx-auto h-12 w-12 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
                  <p className="mt-4 font-display text-lg text-cloud">Building your app...</p>
                  <p className="mt-1 text-sm text-cloud-dim">AI is writing real HTML, CSS, and JavaScript</p>
                </div>
              </div>
              <div className="flex min-h-[400px] items-center justify-center rounded-4xl glass p-12 text-center">
                <div className="text-center">
                  <div className="text-5xl opacity-20">{"\u{1F4BB}"}</div>
                  <p className="mt-4 text-sm text-cloud-dim">Your live preview will appear here</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && !building && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-4xl glass-strong p-8 text-center"
            >
              <div className="text-4xl opacity-50">{"\u26A0\uFE0F"}</div>
              <p className="mt-4 font-display text-lg text-cloud">{error}</p>
              <button
                onClick={() => build(input)}
                className="mt-4 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2.5 font-display font-semibold text-night-950 active:scale-95"
              >
                Try again
              </button>
            </motion.div>
          )}

          {result && !building && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-4xl glass-strong p-6">
                  <div className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-25 blur-3xl", gradient)} />
                  <div className="relative flex items-center gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-glow-lg", gradient)}>
                      <span aria-hidden="true">{result.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-aurora-teal">{result.type}</p>
                      <h3 className="font-display text-xl font-bold text-cloud">{result.title}</h3>
                      <p className="text-sm text-cloud-muted">{result.description}</p>
                    </div>
                  </div>
                  <div className="relative mt-4 rounded-2xl bg-night-950/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">How it works</p>
                    <p className="mt-1 text-sm leading-relaxed text-cloud">{result.howItWorks}</p>
                  </div>
                  <div className="relative mt-3 flex flex-wrap gap-1.5">
                    {result.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-cloud-dim">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-4xl glass p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cloud-dim">What I built &amp; how each part works</p>
                  <div className="space-y-2">
                    {result.components.map((c, i) => (
                      <motion.div
                        key={c.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3 rounded-2xl bg-white/[0.03] p-3"
                      >
                        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-night-950", gradient)}>{i + 1}</div>
                        <div>
                          <p className="text-sm font-semibold text-cloud">{c.name}</p>
                          <p className="text-xs text-cloud-muted">{c.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveProject}
                    disabled={saved}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet px-5 py-2.5 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
                  >
                    {saved ? "Saved!" : "Save to portfolio"}
                  </button>
                  <button
                    onClick={() => build(input)}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-display font-semibold text-cloud transition-all hover:border-white/30 hover:bg-white/5 active:scale-95"
                  >
                    Regenerate
                  </button>
                </div>

                {shareUrl && (
                  <div className="rounded-4xl glass p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Shareable link</p>
                    <div className="flex items-center gap-2">
                      <input
                        ref={linkInputRef}
                        value={shareUrl}
                        readOnly
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="flex-1 truncate rounded-xl bg-night-950/50 px-3 py-2 text-xs text-cloud-muted focus:outline-none"
                      />
                      <button
                        onClick={copyLink}
                        className={cn(
                          "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95",
                          copied ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/10 text-cloud hover:bg-white/20",
                        )}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-aurora-teal hover:underline"
                    >
                      <Icon name="external" className="h-3.5 w-3.5" />
                      Open in new tab
                    </a>
                  </div>
                )}

                <div className="rounded-2xl bg-aurora-amber/10 p-4 text-sm text-aurora-amber">
                  <span className="font-semibold">Your turn:</span> This is a real working app. Save it to your portfolio or share the link with friends and family!
                </div>
              </div>

              <div className="lg:sticky lg:top-20 lg:self-start">
                <div className="overflow-hidden rounded-4xl glass-strong">
                  <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
                      <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
                      <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
                    </div>
                    <div className="mx-auto flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-cloud-dim">
                      <Icon name="globe" className="h-3 w-3" />
                      {result.title}
                    </div>
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="rounded-full px-2 py-1 text-[10px] font-semibold text-cloud-dim transition-colors hover:text-cloud"
                    >
                      {showCode ? "Preview" : "Code"}
                    </button>
                  </div>
                  {showCode ? (
                    <div className="h-[500px] overflow-auto p-4">
                      <pre className="whitespace-pre-wrap break-words text-xs text-cloud-muted">{result.html}</pre>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={result.html}
                      title={`${result.title} preview`}
                      className="h-[500px] w-full border-0"
                      sandbox="allow-scripts allow-popups allow-forms"
                    />
                  )}
                </div>
                <p className="mt-2 text-center text-xs text-cloud-dim">Live preview {"\u00B7"} This is a real app running in your browser</p>
              </div>
            </motion.div>
          )}

          {!result && !building && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <div className="rounded-4xl glass p-12 text-center">
                <div className="text-5xl opacity-30">{"\u{1F6E0}\uFE0F"}</div>
                <p className="mt-4 font-display text-lg text-cloud">Describe an app idea</p>
                <p className="mt-1 text-sm text-cloud-dim">Real AI will build a working app with HTML, CSS, and JavaScript.</p>
              </div>
              <div className="rounded-4xl glass p-12 text-center">
                <div className="text-5xl opacity-30">{"\u{1F4BB}"}</div>
                <p className="mt-4 font-display text-lg text-cloud">Live preview</p>
                <p className="mt-1 text-sm text-cloud-dim">See your app run instantly. Share it with a link.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
