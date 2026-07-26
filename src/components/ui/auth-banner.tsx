"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAIReady } from "@/lib/ai";
import { Icon } from "@/components/icons/icon";

export function AuthBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const check = setInterval(() => {
      if (typeof window !== "undefined" && window.puter && !isAIReady()) {
        setShow(true);
        clearInterval(check);
      }
    }, 2000);
    const timeout = setTimeout(() => clearInterval(check), 20000);
    return () => {
      clearInterval(check);
      clearTimeout(timeout);
    };
  }, [dismissed]);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="rounded-3xl glass-strong p-5 shadow-glow-lg shadow-aurora-violet/30">
            <div className="flex items-start gap-3">
              <Icon name="chat" className="mt-0.5 h-6 w-6 shrink-0 text-cyan-400" />
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-cloud">
                  About the AI popup
                </p>
                <p className="mt-1 text-xs leading-relaxed text-cloud-muted">
                  Somora uses a free AI service called Puter for chat.
                  Sometimes it shows a popup so you can use the AI for free.
                  It&apos;s safe! You can sign in with Google or GitHub, or just
                  close it and try again. You don&apos;t need to pay anything.
                </p>
                <button
                  onClick={() => setDismissed(true)}
                  className="mt-3 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-cloud hover:bg-white/20"
                >
                  Got it!
                </button>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-full p-1 text-cloud-dim hover:bg-white/5"
                aria-label="Dismiss"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
