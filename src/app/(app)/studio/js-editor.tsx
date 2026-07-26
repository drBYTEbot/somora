"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { aiChat } from "@/lib/ai";

const STARTER_CODE = `// Write code here! Have fun!

document.body.innerHTML = \`
  <div style="text-align:center; padding:40px; font-family:Arial;">
    <h1 style="font-size:48px; color:#6366f1;">
      Hello!
    </h1>
    <p style="color:#666; font-size:20px;">
      Edit me and click Run!
    </p>
    <button onclick="alert('Hi!')"
      style="padding:16px 32px; font-size:20px;
      border:none; border-radius:16px;
      background:#6366f1; color:white;
      cursor:pointer; font-weight:bold;">
      Click me!
    </button>
  </div>
\`;`;

const WRAPPER = `<!DOCTYPE html>
<html>
<head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;}</style></head>
<body>
<script>
try {
${"CODE_PLACEHOLDER"}
} catch(e) {
  document.body.innerHTML += '<pre style="color:red;padding:20px;font-size:16px;">' + e.message + '</pre>';
}
<\/script>
</body>
</html>`;

interface ChatMsg { role: "user" | "ai"; text: string }

export function JSEditor() {
  const { addXP } = useStore();
  const [code, setCode] = useState(STARTER_CODE);
  const [previewKey, setPreviewKey] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMsg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReady, setAiReady] = useState(true);

  const run = useCallback(() => {
    setPreviewKey((k) => k + 1);
    addXP(15);
  }, [addXP]);

  const fullHTML = useCallback(() => WRAPPER.replace("CODE_PLACEHOLDER", code), [code]);

  async function askAI() {
    if (!aiInput.trim() || aiLoading) return;
    const question = aiInput;
    setAiMessages((m) => [...m, { role: "user", text: question }]);
    setAiInput("");
    setAiLoading(true);
    try {
      const ctx = `You are a fun coding tutor for kids. The student wrote this JavaScript:\n\n${code}\n\nAnswer briefly and simply. Give code examples if asked. Keep it fun!`;
      const reply = await aiChat(question, [{ role: "user", content: ctx }]);
      setAiMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch {
      setAiMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't connect. Try again!" }]);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Code editor */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-3">
            <span className="text-sm font-bold text-cloud-dim">My Code</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAI(!showAI)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-all",
                  showAI ? "bg-aurora-violet/20 text-aurora-violet" : "bg-white/5 text-cloud-dim hover:text-cloud",
                )}
              >
                {"\u{1F916}"} AI Help
              </button>
              <button
                onClick={run}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2 text-sm font-bold text-night-950 transition-all hover:shadow-glow active:scale-95"
              >
                {"\u25B6"} Run!
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                setCode(code.substring(0, start) + "  " + code.substring(end));
                requestAnimationFrame(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                });
              }
            }}
            spellCheck={false}
            className="h-[440px] w-full resize-none bg-transparent p-4 font-mono text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
            </div>
            <span className="mx-auto text-sm font-semibold text-cloud-dim">My App</span>
          </div>
          <iframe
            key={previewKey}
            srcDoc={fullHTML()}
            title="JS preview"
            className="h-[440px] w-full border-0"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      {/* AI Help panel (slides up from bottom) */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-3xl glass-strong p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{"\u{1F916}"}</span>
                <span className="text-sm font-bold text-cloud">AI Helper</span>
                {aiReady && <span className="h-2 w-2 rounded-full bg-aurora-teal" />}
              </div>

              <div className="mb-3 max-h-[200px] space-y-2 overflow-y-auto">
                {aiMessages.length === 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {["Explain my code", "Add a button", "Make it colorful", "Fix a bug"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setAiInput(q)}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                ) : (
                  aiMessages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                        msg.role === "user" ? "rounded-br-sm bg-aurora-violet/20 text-cloud" : "rounded-bl-sm bg-white/5 text-cloud",
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {aiLoading && (
                  <div className="flex gap-1 rounded-2xl bg-white/5 px-4 py-3 w-fit">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 rounded-full bg-cloud-dim animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askAI()}
                  placeholder="Ask anything..."
                  className="flex-1 rounded-xl bg-night-950/50 px-3 py-2.5 text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
                />
                <button
                  onClick={askAI}
                  disabled={!aiInput.trim() || aiLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-night-950 transition-all hover:shadow-glow disabled:opacity-40 active:scale-95"
                  aria-label="Send"
                >
                  {"\u2192"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
