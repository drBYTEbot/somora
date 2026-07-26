"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";
import { useStore, type ChatMessage } from "@/lib/store";
import { aiChat, isAIReady } from "@/lib/ai";

const suggestedQuestions = [
  "What is AI?",
  "How do machines learn?",
  "What is a neural network?",
  "What is training data?",
  "How do I build a chatbot?",
  "What is bias in AI?",
];

const INTRO_MESSAGE: ChatMessage = {
  id: "intro",
  role: "ai",
  text: "Hi there! I'm your Somora AI tutor. I'm here to help you understand AI, give you hints, and cheer you on. What are you curious about today?",
  ts: Date.now(),
};

export default function AICompanionPage() {
  const { addXP } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAiReady(isAIReady());
    const interval = setInterval(() => {
      if (isAIReady()) {
        setAiReady(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      text,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "intro")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.text }));

      const reply = await aiChat(text, history);

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: "ai" as const,
        text: reply,
        ts: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
      addXP(10);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    setMessages([{ ...INTRO_MESSAGE, ts: Date.now() }]);
    setError(null);
    setInput("");
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl shadow-glow shadow-cyan-500/40">
              <span aria-hidden="true">{"\u{1F916}"}</span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-cloud">
                Somora AI
              </h1>
              <p className="text-sm text-cloud-muted">
                Your personal AI tutor {"\u00B7"} always curious, always patient
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Start a new chat"
            >
              <Icon name="refresh" className="h-3.5 w-3.5" />
              New chat
            </button>
            {!aiReady && (
              <span className="flex items-center gap-1.5 rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora-amber" />
                Connecting...
              </span>
            )}
            {aiReady && (
              <span className="flex items-center gap-1.5 rounded-full bg-aurora-teal/15 px-3 py-1 text-xs font-semibold text-aurora-teal">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-teal" />
                Online
              </span>
            )}
          </div>
        </div>

        <div className="flex h-[560px] flex-col overflow-hidden rounded-4xl glass-strong">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "ai" && (
                    <div className="mr-2 mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm shadow-glow shadow-cyan-500/40">
                      <span aria-hidden="true">{"\u{1F916}"}</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-gradient-to-r from-aurora-violet/30 to-aurora-bloom/20 text-cloud"
                        : "rounded-bl-sm bg-white/5 text-cloud",
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm">
                  <span aria-hidden="true">{"\u{1F916}"}</span>
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-cloud-dim animate-twinkle"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-2xl bg-aurora-rose/10 px-4 py-3 text-sm text-aurora-rose">
                {error}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 2 && !loading && (
            <div className="border-t border-white/5 px-5 py-3">
              <p className="mb-2 text-xs text-cloud-dim">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask me anything about AI..."
                className="flex-1 bg-transparent px-3 py-2.5 text-cloud placeholder:text-cloud-dim focus:outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-night-950 transition-all hover:shadow-glow hover:shadow-cyan-500/40 disabled:opacity-40 active:scale-95"
                aria-label="Send message"
              >
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-cloud-dim">
          Real AI powered by Puter.js {"\u00B7"} You earn 10 XP for each
          conversation
        </div>
      </div>
    </div>
  );
}
