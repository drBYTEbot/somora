"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";

interface Message {
  from: string;
  fromName: string;
  subject: string;
  text: string;
  spam: boolean;
  reason: string;
}

const messages: Message[] = [
  {
    from: "sarah@gmail.com",
    fromName: "Sarah",
    subject: "Roblox later?",
    text: "Hey! Want to play Roblox later?",
    spam: false,
    reason: "This is a real friend. Normal email, no links, no pressure.",
  },
  {
    from: "winner@prize-giveaway.net",
    fromName: "Prize Department",
    subject: "CONGRATULATIONS! You won $1,000,000!",
    text: "You've been selected as our grand prize winner! Click here to claim your $1,000,000 now before it expires!",
    spam: true,
    reason: "Suspicious email address, too-good-to-be-true offer, pressure to click immediately.",
  },
  {
    from: "mom@gmail.com",
    fromName: "Mom",
    subject: "Dinner",
    text: "Mom said dinner is ready at 6",
    spam: false,
    reason: "Real person, normal subject, no links or threats.",
  },
  {
    from: "vbucks@free-vbucks-generator.tk",
    fromName: "Free V-Bucks",
    subject: "FREE V-BUCKS! Limited time!",
    text: "Get unlimited free V-Bucks! Just enter your Fortnite username and password here!",
    spam: true,
    reason: "Sketchy .tk domain, asks for your password, fake free currency offer.",
  },
  {
    from: "mike@yahoo.com",
    fromName: "Mike",
    subject: "Math homework",
    text: "Can you help me with the math homework?",
    spam: false,
    reason: "Normal email from a friend asking for help. No links, no urgency.",
  },
  {
    from: "security@account-verify-required.com",
    fromName: "Account Security",
    subject: "URGENT: Account will be deleted!",
    text: "Your account will be permanently deleted in 24 hours! Verify your identity now by clicking this link and entering your password.",
    spam: true,
    reason: "Fake urgency, suspicious domain, asks for password. Real services never do this.",
  },
  {
    from: "jess@gmail.com",
    fromName: "Jess",
    subject: "Movie",
    text: "The new Avengers movie is so good! We should go see it this weekend",
    spam: false,
    reason: "Real friend talking about normal stuff. No links, no threats.",
  },
  {
    from: "recruiter@work-from-home.biz",
    fromName: "HR Department",
    subject: "Make $5000/day from home!",
    text: "No experience needed! Work from home and earn $5000 per day! Send your bank details to get started immediately.",
    spam: true,
    reason: "Unrealistic income, .biz domain, asks for bank info. No real job does this.",
  },
  {
    from: "teacher@school.edu",
    fromName: "Mr. Rodriguez",
    subject: "Science project",
    text: "Did you finish the science project? Don't forget it's due Friday.",
    spam: false,
    reason: "Real .edu email from a teacher. Normal school stuff.",
  },
  {
    from: "apple@icloud-support-verify.ml",
    fromName: "Apple Support",
    subject: "Your iCloud will be locked!",
    text: "We detected suspicious activity. Your iCloud account will be locked in 2 hours! Click here to verify and keep your photos safe.",
    spam: true,
    reason: "Not a real Apple domain (.ml instead of apple.com), fake urgency, phishing link.",
  },
];

export function SpamDetective() {
  const { recordGamePlay, unlockAchievement } = useStore();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const current = messages[index];

  function choose(spam: boolean) {
    if (answered) return;
    const correct = spam === current.spam;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct);
    setAnswered(true);
  }

  function next() {
    if (index + 1 >= messages.length) {
      recordGamePlay("spam-detective", score);
      if (score >= 7) unlockAchievement("spam-slayer");
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setFeedback(null);
    setAnswered(false);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
    setAnswered(false);
  }

  if (finished) {
    return (
      <div className="rounded-4xl glass-strong p-10 text-center">
        <Icon name="star" className={cn("mx-auto h-12 w-12", score >= 7 ? "text-aurora-teal" : "text-aurora-amber")} />
        <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
          {score >= 7 ? "Case closed, Detective!" : "Keep investigating!"}
        </h3>
        <p className="mt-2 text-cloud-muted">You caught <span className="font-bold text-aurora-teal">{score}</span> out of {messages.length} correctly.</p>
        <Button onClick={restart} className="mt-6">Play again</Button>
      </div>
    );
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">
          Email {index + 1} / {messages.length}
        </span>
        <span className="text-xs text-cloud-dim">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-3xl bg-night-950/40 p-5"
        >
          {/* Email header */}
          <div className="border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                <Icon name="profile" className="h-4 w-4 text-cloud-dim" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-cloud">{current.fromName}</p>
                <p className="truncate text-xs text-cloud-dim">{current.from}</p>
              </div>
            </div>
          </div>
          {/* Subject */}
          <p className="mt-3 text-sm font-bold text-cloud">{current.subject}</p>
          {/* Body */}
          <p className="mt-1 text-sm leading-relaxed text-cloud-muted">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {feedback !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("mt-4 rounded-2xl p-4 text-sm", feedback ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}
        >
          <p className="font-bold">{feedback ? "Correct!" : `Wrong! This was ${current.spam ? "SPAM" : "a real email"}.`}</p>
          <p className="mt-1 text-cloud-muted">{current.reason}</p>
        </motion.div>
      )}

      <div className="mt-5 flex gap-3">
        {answered ? (
          <Button onClick={next} className="w-full">
            {index + 1 >= messages.length ? "See results" : "Next email"}
          </Button>
        ) : (
          <>
            <button onClick={() => choose(false)} className="flex-1 rounded-2xl bg-aurora-teal/10 px-4 py-3 font-display font-semibold text-aurora-teal ring-1 ring-aurora-teal/30 transition-all hover:bg-aurora-teal/20 active:scale-95">
              Real
            </button>
            <button onClick={() => choose(true)} className="flex-1 rounded-2xl bg-aurora-rose/10 px-4 py-3 font-display font-semibold text-aurora-rose ring-1 ring-aurora-rose/30 transition-all hover:bg-aurora-rose/20 active:scale-95">
              Spam
            </button>
          </>
        )}
      </div>
    </div>
  );
}
