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
    // Check if Puter.js is loaded but AI isn't ready after 3 seconds
    // This likely means the auth popup appeared
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.puter && !isAIReady()) {
        setShow(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Also check if puter exists but auth is needed
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.puter && !isAIReady() && !show) {
        setShow(true);
        clearInterval(interval);
      }
    }, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 15000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dismissed, show]);

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
              <div className="text-2xl">{"\u{1F916}"}</div>
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
