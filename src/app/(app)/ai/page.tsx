"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const suggestedQuestions = [
  "What is AI?",
  "How do machines learn?",
  "What is a neural network?",
  "What is training data?",
  "How do I build a chatbot?",
  "What is bias in AI?",
];

const responses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["what is ai", "what's ai", "ai mean", "define ai", "artificial intelligence"],
    reply: "Great question! AI \u2014 or Artificial Intelligence \u2014 is when we teach computers to do things that usually need human thinking. Things like recognizing a face, understanding speech, or deciding what to recommend next. It's not magic; it's patterns learned from lots of examples. Want to learn how it actually learns?",
  },
  {
    keywords: ["how do machines learn", "how does ai learn", "machine learn", "how learn"],
    reply: "Machines learn a lot like you do \u2014 by example! Imagine I show you 100 photos of cats and say 'these are cats.' Then 100 dogs and say 'these are dogs.' Soon your brain notices the difference. AI does the same thing with data. The more good examples it sees, the better it gets. This is called 'training.' Want to try training one yourself?",
  },
  {
    keywords: ["neural network", "neuron", "deep learning"],
    reply: "A neural network is inspired by your brain! Your brain has billions of neurons that pass signals to each other. A neural network has 'neurons' too \u2014 little math units arranged in layers. Information flows in one side, gets processed through the layers, and comes out the other side as a prediction. The 'deep' in deep learning just means lots of layers! Want to build one in the Arcade?",
  },
  {
    keywords: ["training data", "what is data", "dataset", "data"],
    reply: "Training data is the examples you give an AI so it can learn. Think of it like flashcards! If you want to teach an AI to recognize cats, you show it thousands of cat photos labeled 'cat.' Good data = good AI. Bad data = confused AI. That's why data quality matters so much. Want to play Data Detective and spot good vs bad data?",
  },
  {
    keywords: ["build a chatbot", "make a chatbot", "chatbot", "build ai"],
    reply: "I love that you want to build! You can create a chatbot right here in Somora Studio. Just describe what you want it to do \u2014 like 'make a chatbot that teaches dinosaurs' \u2014 and Somora will build a starting point for you. Then you can customize its personality, knowledge, and responses. Want me to take you there?",
  },
  {
    keywords: ["bias", "fair", "unfair", "discrimination"],
    reply: "Bias in AI is when a model makes unfair decisions, usually because its training data was skewed. For example, if an AI only sees photos of one type of person, it won't recognize others well. The fix? Better, more diverse data \u2014 and humans who check for fairness. This is one of the most important parts of building AI responsibly. Want to play Bias Detective?",
  },
  {
    keywords: ["prompt", "prompting", "how to talk to ai"],
    reply: "Prompting is how you talk to an AI. The better you describe what you want, the better the result! A good prompt includes: what you want, the format, the tone, and any rules. For example, instead of 'write a story,' try 'write a 5-sentence bedtime story about a brave robot, in a gentle tone.' Want to practice in the Prompt Wizard game?",
  },
  {
    keywords: ["help", "stuck", "don't understand", "confused"],
    reply: "I'm here for you! Learning AI is a big adventure and it's okay to feel stuck. What are you working on? I can explain it differently, give you a hint, or we can break it into smaller steps together. Remember: every expert was once a beginner who kept asking questions.",
  },
];

function findReply(text: string): string {
  const lower = text.toLowerCase();
  for (const r of responses) {
    if (r.keywords.some((k) => lower.includes(k))) return r.reply;
  }
  return "That's a great question! I'm a preview of Somora AI \u2014 in the full version I'll be able to answer anything you're curious about. For now, try asking me about: what AI is, how machines learn, neural networks, training data, building chatbots, bias, or prompting. Or explore the Academy for structured lessons!";
}

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: "Hi there! I'm your Somora AI tutor. I'm here to help you understand AI, give you hints, and cheer you on. What are you curious about today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: Date.now() + 1, role: "ai", text: findReply(text) };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, 1200);
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl shadow-glow shadow-cyan-500/40">
            <span aria-hidden="true">{"\u{1F916}"}</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cloud">Somora AI</h1>
            <p className="text-sm text-cloud-muted">Your personal AI tutor {"\u00B7"} always curious, always patient</p>
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
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
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
            {typing && (
              <div className="flex justify-start">
                <div className="mr-2 mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm">
                  <span aria-hidden="true">{"\u{1F916}"}</span>
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-cloud-dim animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 2 && (
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
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-night-950 transition-all hover:shadow-glow hover:shadow-cyan-500/40 disabled:opacity-40 active:scale-95"
                aria-label="Send message"
              >
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Adaptive tutoring", emoji: "\u{1F4A1}" },
            { label: "Hint generation", emoji: "\u{1F514}" },
            { label: "Code review", emoji: "\u{1F4BB}" },
            { label: "Goal tracking", emoji: "\u{1F3AF}" },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl glass p-3 text-center">
              <div className="text-xl">{f.emoji}</div>
              <p className="mt-1 text-xs text-cloud-muted">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
