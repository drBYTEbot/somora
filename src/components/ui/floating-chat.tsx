"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";
import { aiChat } from "@/lib/ai";

interface ChatMsg {
  id: string;
  role: "user" | "ai";
  text: string;
}

const INTRO = "Hi! I'm your AI buddy. Ask me anything!";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "intro", role: "ai", text: INTRO },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReady, setAiReady] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg = { id: `msg-${Date.now()}`, role: "user" as const, text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages
        .filter((m) => m.id !== "intro")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.text }));
      const reply = await aiChat(text, history);
      setMessages((m) => [...m, { id: `msg-${Date.now() + 1}`, role: "ai", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, {
        id: `msg-${Date.now() + 1}`,
        role: "ai",
        text: err instanceof Error ? err.message : "Something went wrong. Try again!",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI chat"
      >
        <Icon name={open ? "close" : "chat"} className="h-6 w-6 text-white" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[440px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-4xl glass-strong"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon name="chat" className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-bold text-cloud">AI Buddy</span>
                {aiReady && <span className="h-2 w-2 rounded-full bg-aurora-teal" />}
              </div>
              <button
                onClick={() => {
                  setMessages([{ id: "intro", role: "ai", text: INTRO }]);
                }}
                className="rounded-full p-1 text-cloud-dim hover:bg-white/5 hover:text-cloud"
                aria-label="New chat"
              >
                <Icon name="refresh" className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-aurora-violet/20 text-cloud"
                        : "rounded-bl-sm bg-white/5 text-cloud",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 rounded-full bg-cloud-dim animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask anything..."
                  className="flex-1 rounded-xl bg-night-950/50 px-3 py-2 text-xs text-cloud placeholder:text-cloud-dim focus:outline-none"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition-all hover:shadow-glow disabled:opacity-40 active:scale-95"
                  aria-label="Send"
                >
                  <Icon name="send" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
