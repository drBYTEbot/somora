"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { aiChat, isAIReady } from "@/lib/ai";

const STARTER_CODE = `// Welcome to JavaScript Studio!
// Write real code and see it run instantly.

// Try changing this:
const greeting = "Hello, World!";
document.body.innerHTML = \`
  <div style="text-align:center; padding:40px; font-family:Arial;">
    <h1 style="font-size:48px; color:#6366f1;">\${greeting}</h1>
    <p style="color:#666;">Edit the code and click Run!</p>
    <button onclick="alert('You clicked!')" 
      style="padding:12px 24px; font-size:18px; border:none; 
      border-radius:12px; background:#6366f1; color:white; 
    cursor:pointer; font-weight:bold;">
      Click me!
    </button>
  </div>
\`;
`;

const STARTER_HTML = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f0f0; }
</style>
</head>
<body>
</body>
</html>`;

interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

export function JSEditor() {
  const { addXP } = useStore();
  const [code, setCode] = useState(STARTER_CODE);
  const [previewKey, setPreviewKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<ChatMsg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const check = setInterval(() => {
      if (isAIReady()) {
        setAiReady(true);
        clearInterval(check);
      }
    }, 1000);
    return () => clearInterval(check);
  }, []);

  const run = useCallback(() => {
    setError(null);
    addXP(15);
    setPreviewKey((k) => k + 1);
  }, [addXP]);

  const fullHTML = useCallback(() => {
    return `${STARTER_HTML.replace("</body>", "")}
<script>
try {
${code}
} catch(e) {
  document.body.innerHTML += '<pre style="color:red;padding:20px;">' + e.message + '</pre>';
  console.error(e);
}
<\/script>
</body>
</html>`;
  }, [code]);

  async function askAI() {
    if (!aiInput.trim() || aiLoading) return;
    const question = aiInput;
    setAiMessages((m) => [...m, { role: "user", text: question }]);
    setAiInput("");
    setAiLoading(true);
    try {
      const systemContext = `You are a helpful coding tutor for kids learning JavaScript. The student is working on this code:\n\n${code}\n\nAnswer their question briefly and simply. If they ask for code, give working examples. Keep it fun and encouraging!`;
      const reply = await aiChat(question, [{ role: "user", content: systemContext }]);
      setAiMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      setAiMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't connect. Try again!" }]);
    } finally {
      setAiLoading(false);
    }
  }

  function resetCode() {
    setCode(STARTER_CODE);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className={cn("grid gap-4", showAI ? "lg:grid-cols-[1fr_320px]" : "lg:grid-cols-1")}>
        {/* Editor + Preview */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Code editor */}
          <div className="overflow-hidden rounded-3xl glass-strong">
            <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-2.5">
              <span className="text-xs font-semibold text-cloud-dim">script.js</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetCode}
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-cloud-dim transition-colors hover:text-cloud"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowAI(!showAI)}
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-cloud-dim transition-colors hover:text-cloud lg:hidden"
                >
                  {showAI ? "Hide AI" : "AI Help"}
                </button>
                <button
                  onClick={run}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-4 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95"
                >
                  Run {"\u25B6"}
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const newCode = code.substring(0, start) + "  " + code.substring(end);
                    setCode(newCode);
                    requestAnimationFrame(() => {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                    });
                  }
                }}
                spellCheck={false}
                className="h-[460px] w-full resize-none bg-transparent p-4 font-mono text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="overflow-hidden rounded-3xl glass-strong">
            <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
                <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
                <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
              </div>
              <span className="mx-auto text-xs text-cloud-dim">Live Preview</span>
            </div>
            <iframe
              key={previewKey}
              ref={iframeRef}
              srcDoc={fullHTML()}
              title="JS preview"
              className="h-[460px] w-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>

        {/* AI Assistant sidebar */}
        {showAI && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col overflow-hidden rounded-3xl glass-strong"
          >
            <div className="border-b border-white/10 bg-night-950/50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{"\u{1F916}"}</span>
                <span className="text-xs font-semibold text-cloud">AI Tutor</span>
                {aiReady ? (
                  <span className="ml-auto h-2 w-2 rounded-full bg-aurora-teal" />
                ) : (
                  <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-aurora-amber" />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ maxHeight: "380px" }}>
              {aiMessages.length === 0 && (
                <div className="rounded-2xl bg-white/[0.03] p-4 text-center text-xs text-cloud-dim">
                  Ask me anything about your code! I can explain things, fix bugs, or suggest ideas.
                  <div className="mt-3 space-y-1.5">
                    <button
                      onClick={() => setAiInput("Explain what this code does")}
                      className="block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-cloud-muted transition-colors hover:bg-white/10 hover:text-cloud"
                    >
                      {"\u{1F4CB}"} Explain what this code does
                    </button>
                    <button
                      onClick={() => setAiInput("How do I add a button?")}
                      className="block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-cloud-muted transition-colors hover:bg-white/10 hover:text-cloud"
                    >
                      {"\u{1F534}"} How do I add a button?
                    </button>
                    <button
                      onClick={() => setAiInput("Make it more colorful!")}
                      className="block w-full rounded-lg bg-white/5 px-3 py-2 text-left text-xs text-cloud-muted transition-colors hover:bg-white/10 hover:text-cloud"
                    >
                      {"\u{1F3A8}"} Make it more colorful!
                    </button>
                  </div>
                </div>
              )}
              {aiMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-sm bg-aurora-violet/20 text-cloud"
                        : "rounded-bl-sm bg-white/5 text-cloud",
                    )}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3">
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
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askAI()}
                  placeholder="Ask about your code..."
                  className="flex-1 bg-transparent px-2 py-2 text-xs text-cloud placeholder:text-cloud-dim focus:outline-none"
                />
                <button
                  onClick={askAI}
                  disabled={!aiInput.trim() || aiLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-night-950 transition-all hover:shadow-glow disabled:opacity-40 active:scale-95"
                  aria-label="Send to AI"
                >
                  {"\u2192"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-3 rounded-2xl bg-aurora-amber/10 p-3 text-xs text-aurora-amber">
        <span className="font-semibold">Pro tip:</span> Press Tab for spaces. Use document.body.innerHTML to build your UI. The AI tutor can see your code and help you!
      </div>
    </div>
  );
}
