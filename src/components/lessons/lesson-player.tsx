"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { getLessonContent, type SortItem, type MatchPair } from "@/config/lesson-content";
import type { Lesson, CurriculumTrack } from "@/config/curriculum";
import { Icon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";

export function LessonPlayer({
  lesson,
  track,
  onClose,
}: {
  lesson: Lesson;
  track: CurriculumTrack;
  onClose: () => void;
}) {
  const { completeLesson, isLessonComplete, addXP } = useStore();
  const [completed, setCompleted] = useState(isLessonComplete(lesson.id));
  const content = getLessonContent(lesson.id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleComplete() {
    const wasNew = completeLesson(lesson.id, 80);
    if (wasNew) addXP(0);
    setCompleted(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-night-950/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl glass-strong"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xl", track.gradient)}>
              <span aria-hidden="true">{track.emoji}</span>
            </div>
            <div>
              <p className={cn("text-xs font-semibold uppercase tracking-wider", track.text)}>{track.title}</p>
              <h2 className="font-display text-lg font-bold text-cloud">{lesson.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-cloud-muted hover:bg-white/5" aria-label="Close lesson">
            <Icon name="close" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!content ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-5xl opacity-30">{"\u{1F4DA}"}</div>
              <p className="mt-4 text-cloud-muted">This lesson&apos;s content is being prepared.</p>
              <Button onClick={handleComplete} className="mt-4">Mark as complete</Button>
            </div>
          ) : content.type === "story" && content.story ? (
            <StoryLesson content={content.story} onComplete={handleComplete} completed={completed} />
          ) : content.type === "quiz" && content.quiz ? (
            <QuizLesson content={content.quiz} onComplete={handleComplete} completed={completed} />
          ) : content.type === "interactive" && content.interactive ? (
            <InteractiveLesson content={content.interactive} onComplete={handleComplete} completed={completed} />
          ) : content.type === "challenge" && content.challenge ? (
            <ChallengeLesson content={content.challenge} onComplete={handleComplete} completed={completed} />
          ) : content.type === "mini-game" && content.miniGame ? (
            <MiniGameLesson content={content.miniGame} onComplete={handleComplete} completed={completed} />
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== STORY LESSON =====
function StoryLesson({ content, onComplete, completed }: { content: NonNullable<ReturnType<typeof getLessonContent>>["story"]; onComplete: () => void; completed: boolean }) {
  const [chapter, setChapter] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");

  if (!content) return null;
  const isLastChapter = chapter >= content.chapters.length - 1;

  if (showReflection) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl bg-aurora-violet/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-aurora-violet">Reflection</p>
          <p className="mt-2 font-display text-lg text-cloud">{content.reflection}</p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
            className="mt-4 w-full resize-none rounded-2xl bg-night-950/50 px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
          />
          <Button
            onClick={onComplete}
            className="mt-4 w-full"
          >
            {completed ? "Completed!" : "Complete lesson (+80 XP)"}
          </Button>
        </div>
      </div>
    );
  }

  const ch = content.chapters[chapter];
  return (
    <div className="mx-auto max-w-lg">
      {/* Progress dots */}
      <div className="mb-6 flex justify-center gap-2">
        {content.chapters.map((_, i) => (
          <div
            key={i}
            className={cn("h-2 rounded-full transition-all duration-300", i === chapter ? "w-8 bg-aurora-violet" : i < chapter ? "w-2 bg-aurora-violet/50" : "w-2 bg-white/10")}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={chapter}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="rounded-4xl glass p-8 text-center"
        >
          <div className="mb-6 text-6xl">{ch.emoji}</div>
          <p className="text-lg leading-relaxed text-cloud">{ch.text}</p>
        </motion.div>
      </AnimatePresence>

      {chapter === 0 && content.intro && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl bg-night-950/40 p-4 text-center text-sm text-cloud-muted">
          {content.intro}
        </motion.div>
      )}

      <div className="mt-6 flex justify-center">
        <Button onClick={() => isLastChapter ? setShowReflection(true) : setChapter((c) => c + 1)}>
          {isLastChapter ? "Reflect" : "Next"}
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ===== QUIZ LESSON =====
function QuizLesson({ content, onComplete, completed }: { content: NonNullable<ReturnType<typeof getLessonContent>>["quiz"]; onComplete: () => void; completed: boolean }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!content) return null;
  const question = content.questions[currentQ];
  const passed = score >= Math.ceil(content.questions.length * content.passingScore / 100);

  if (showResults) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="text-6xl">{passed ? "\u{1F3C6}" : "\u{1F4DD}"}</div>
        <h3 className="mt-4 font-display text-2xl font-bold text-cloud">
          {passed ? "You passed!" : "Keep learning!"}
        </h3>
        <p className="mt-2 text-cloud-muted">
          You scored <span className="font-bold text-aurora-teal">{score}</span> out of {content.questions.length}.
        </p>
        {!passed && (
          <p className="mt-2 text-sm text-cloud-dim">Review the lesson and try again to earn your XP!</p>
        )}
        <div className="mt-6 flex gap-3">
          {!passed && (
            <Button
              onClick={() => {
                setCurrentQ(0);
                setSelected(null);
                setAnswered(false);
                setScore(0);
                setShowResults(false);
              }}
              variant="outline"
              className="flex-1"
            >
              Try again
            </Button>
          )}
          {passed && (
            <Button onClick={onComplete} className="flex-1">
              {completed ? "Completed!" : "Complete lesson (+80 XP)"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  function answer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) setScore((s) => s + 1);
  }

  function next() {
    if (currentQ + 1 >= content!.questions.length) {
      setShowResults(true);
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelected(null);
    setAnswered(false);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-aurora-sky/15 px-3 py-1 text-xs font-semibold text-aurora-sky">
          Question {currentQ + 1} of {content.questions.length}
        </span>
        <span className="text-xs text-cloud-dim">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-6 rounded-3xl glass p-6">
            <h3 className="font-display text-lg font-bold text-cloud">{question.question}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isCorrect = idx === question.correct;
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => answer(idx)}
                  disabled={answered}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                    !answered && "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                    answered && isCorrect && "border-aurora-teal/50 bg-aurora-teal/10",
                    answered && isSelected && !isCorrect && "border-aurora-rose/50 bg-aurora-rose/10",
                    answered && !isSelected && !isCorrect && "opacity-40",
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                    !answered && "bg-white/5 text-cloud-dim",
                    answered && isCorrect && "bg-aurora-teal/20 text-aurora-teal",
                    answered && isSelected && !isCorrect && "bg-aurora-rose/20 text-aurora-rose",
                  )}>
                    {answered && isCorrect ? "\u2713" : answered && isSelected && !isCorrect ? "\u2717" : String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm text-cloud">{option}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-4 rounded-2xl p-4 text-sm",
                  selected === question.correct ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose",
                )}
              >
                <p className="font-semibold">
                  {selected === question.correct ? "Correct!" : "Not quite."}
                </p>
                <p className="mt-1 text-cloud-muted">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <Button onClick={next} className="mt-4 w-full">
              {currentQ + 1 >= content.questions.length ? "See results" : "Next question"}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ===== INTERACTIVE LESSON =====
function InteractiveLesson({ content, onComplete, completed }: { content: NonNullable<ReturnType<typeof getLessonContent>>["interactive"]; onComplete: () => void; completed: boolean }) {
  if (!content) return null;

  if (content.activity === "sort" && content.items && content.categories) {
    return <SortActivity items={content.items} categories={content.categories} intro={content.intro} onComplete={onComplete} completed={completed} />;
  }
  if (content.activity === "match" && content.pairs) {
    return <MatchActivity pairs={content.pairs} intro={content.intro} onComplete={onComplete} completed={completed} />;
  }
  return <div>Activity coming soon</div>;
}

function SortActivity({ items, categories, intro, onComplete, completed }: { items: SortItem[]; categories: string[]; intro: string; onComplete: () => void; completed: boolean }) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [finished, setFinished] = useState(false);

  const current = shuffled[currentIdx];

  function choose(cat: string) {
    if (feedback !== null) return;
    const isCorrect = cat === current.category;
    if (isCorrect) setCorrect((c) => c + 1);
    setFeedback(isCorrect);
  }

  function next() {
    if (currentIdx + 1 >= shuffled.length) {
      setFinished(true);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setFeedback(null);
  }

  if (finished) {
    const passed = correct >= Math.ceil(items.length * 0.7);
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="text-6xl">{passed ? "\u{1F3C6}" : "\u{1F4CA}"}</div>
        <h3 className="mt-4 font-display text-2xl font-bold text-cloud">
          {passed ? "Great sorting!" : "Keep practicing!"}
        </h3>
        <p className="mt-2 text-cloud-muted">You sorted <span className="font-bold text-aurora-teal">{correct}</span> out of {items.length} correctly.</p>
        {passed && (
          <Button onClick={onComplete} className="mt-6">
            {completed ? "Completed!" : "Complete lesson (+80 XP)"}
          </Button>
        )}
        {!passed && (
          <Button
            onClick={() => { setCurrentIdx(0); setCorrect(0); setFeedback(null); setFinished(false); }}
            variant="outline"
            className="mt-6"
          >
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 rounded-2xl bg-night-950/40 p-4 text-center text-sm text-cloud-muted">{intro}</div>
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-aurora-teal/15 px-3 py-1 text-xs font-semibold text-aurora-teal">
          {currentIdx + 1} / {items.length}
        </span>
        <span className="text-xs text-cloud-dim">Correct: {correct}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="rounded-3xl glass p-8 text-center"
        >
          <div className="mb-3 text-5xl">{current.emoji}</div>
          <p className="font-display text-lg text-cloud">{current.label}</p>
        </motion.div>
      </AnimatePresence>

      {feedback !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("mt-4 rounded-2xl p-3 text-center text-sm font-semibold", feedback ? "bg-aurora-teal/10 text-aurora-teal" : "bg-aurora-rose/10 text-aurora-rose")}
        >
          {feedback ? "\u2705 Correct!" : `\u274C The answer was: ${current.category}`}
        </motion.div>
      )}

      <div className="mt-5 flex gap-3">
        {feedback === null ? (
          categories.map((cat) => (
            <button
              key={cat}
              onClick={() => choose(cat)}
              className="flex-1 rounded-2xl bg-white/5 px-4 py-3 font-display text-sm font-semibold text-cloud ring-1 ring-white/10 transition-all hover:bg-white/10 active:scale-95"
            >
              {cat}
            </button>
          ))
        ) : (
          <Button onClick={next} className="w-full">
            {currentIdx + 1 >= items.length ? "See results" : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}

function MatchActivity({ pairs, intro, onComplete, completed }: { pairs: MatchPair[]; intro: string; onComplete: () => void; completed: boolean }) {
  const shuffledDefs = [...pairs].sort(() => Math.random() - 0.5).map((p) => p.definition);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  const allMatched = Object.keys(matches).length === pairs.length;

  function tryMatch(def: string) {
    if (!selectedTerm) return;
    const correctDef = pairs.find((p) => p.term === selectedTerm)?.definition;
    if (def === correctDef) {
      setMatches((m) => ({ ...m, [selectedTerm]: def }));
      setSelectedTerm(null);
    } else {
      setWrongPair(def);
      setTimeout(() => setWrongPair(null), 800);
    }
  }

  if (allMatched) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="text-6xl">{"\u{1F3C6}"}</div>
        <h3 className="mt-4 font-display text-2xl font-bold text-cloud">All matched!</h3>
        <p className="mt-2 text-cloud-muted">You matched all {pairs.length} terms correctly.</p>
        <Button onClick={onComplete} className="mt-6">
          {completed ? "Completed!" : "Complete lesson (+80 XP)"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 rounded-2xl bg-night-950/40 p-4 text-center text-sm text-cloud-muted">{intro}</div>
      <div className="mb-2 text-center text-xs text-cloud-dim">
        {Object.keys(matches).length} / {pairs.length} matched
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Terms */}
        <div className="space-y-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-cloud-dim">Terms</p>
          {pairs.map((pair) => {
            const matched = !!matches[pair.term];
            return (
              <button
                key={pair.term}
                onClick={() => !matched && setSelectedTerm(pair.term)}
                disabled={matched}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left text-sm transition-all",
                  matched && "border-aurora-teal/30 bg-aurora-teal/5 text-aurora-teal opacity-60",
                  !matched && selectedTerm === pair.term && "border-aurora-violet/50 bg-aurora-violet/10 text-cloud",
                  !matched && selectedTerm !== pair.term && "border-white/10 bg-white/[0.03] text-cloud hover:bg-white/[0.06]",
                )}
              >
                {matched ? "\u2705 " : ""}{pair.term}
              </button>
            );
          })}
        </div>

        {/* Definitions */}
        <div className="space-y-2">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-cloud-dim">Definitions</p>
          {shuffledDefs.map((def) => {
            const used = Object.values(matches).includes(def);
            return (
              <button
                key={def}
                onClick={() => !used && tryMatch(def)}
                disabled={used || !selectedTerm}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left text-xs transition-all",
                  used && "border-aurora-teal/30 bg-aurora-teal/5 opacity-60",
                  !used && wrongPair === def && "border-aurora-rose/50 bg-aurora-rose/10 animate-pulse",
                  !used && wrongPair !== def && selectedTerm && "border-white/15 bg-white/[0.05] hover:bg-white/[0.08] cursor-pointer",
                  !used && !selectedTerm && "border-white/10 bg-white/[0.03] opacity-50",
                )}
              >
                {used ? "\u2705 " : ""}{def}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTerm && (
        <p className="mt-4 text-center text-xs text-cloud-dim">
          Now click the matching definition for: <span className="font-semibold text-aurora-violet">{selectedTerm}</span>
        </p>
      )}
    </div>
  );
}

// ===== CHALLENGE LESSON =====
function ChallengeLesson({ content, onComplete, completed }: { content: NonNullable<ReturnType<typeof getLessonContent>>["challenge"]; onComplete: () => void; completed: boolean }) {
  const [answer, setAnswer] = useState("");
  const [hintIdx, setHintIdx] = useState(-1);
  const [showReflection, setShowReflection] = useState(false);

  if (!content) return null;

  if (showReflection) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl bg-aurora-amber/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-aurora-amber">Reflection</p>
          <p className="mt-2 font-display text-lg text-cloud">{content.reflection}</p>
        </div>
        <Button onClick={onComplete} className="mt-4 w-full">
          {completed ? "Completed!" : "Complete lesson (+80 XP)"}
        </Button>
      </div>
    );
  }

  const minWords = 15;
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= minWords;

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl glass p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">Challenge</span>
        </div>
        <p className="font-display text-lg text-cloud">{content.prompt}</p>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer here... (at least 15 words)"
        rows={6}
        className="mt-4 w-full resize-none rounded-2xl bg-night-950/50 px-4 py-3 text-cloud placeholder:text-cloud-dim focus:outline-none"
      />
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className={cn(wordCount >= minWords ? "text-aurora-teal" : "text-cloud-dim")}>
          {wordCount} words {wordCount >= minWords ? "\u2705" : `(${minWords - wordCount} more)`}
        </span>
      </div>

      {hintIdx >= 0 && hintIdx < content.hints.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-aurora-sky/10 p-4 text-sm text-cloud"
        >
          <span className="font-semibold text-aurora-sky">Hint {hintIdx + 1}:</span> {content.hints[hintIdx]}
        </motion.div>
      )}

      <div className="mt-4 flex gap-3">
        {hintIdx < content.hints.length - 1 && (
          <button
            onClick={() => setHintIdx((h) => h + 1)}
            className="rounded-full bg-white/5 px-4 py-2.5 text-sm font-semibold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
          >
            {hintIdx < 0 ? "Show hint" : "Another hint"}
          </button>
        )}
        <button
          onClick={() => canSubmit && setShowReflection(true)}
          disabled={!canSubmit}
          className={cn(
            "flex-1 rounded-full px-5 py-2.5 font-display font-semibold transition-all active:scale-95",
            canSubmit
              ? "bg-gradient-to-r from-aurora-teal to-aurora-violet text-night-950 hover:shadow-glow hover:shadow-aurora-violet/40"
              : "bg-white/5 text-cloud-dim opacity-50",
          )}
        >
          Submit answer
        </button>
      </div>
    </div>
  );
}

// ===== MINI-GAME LESSON =====
function MiniGameLesson({ content, onComplete, completed }: { content: NonNullable<ReturnType<typeof getLessonContent>>["miniGame"]; onComplete: () => void; completed: boolean }) {
  if (!content) return null;

  const gameLinks: Record<string, { name: string; emoji: string; href: string }> = {
    "train-robot": { name: "Train a Robot", emoji: "\u{1F916}", href: "/arcade" },
    "data-detective": { name: "Data Detective", emoji: "\u{1F50D}", href: "/arcade" },
    "prompt-wizard": { name: "Prompt Wizard", emoji: "\u{1F9D9}", href: "/arcade" },
    "neural-builder": { name: "Neural Network Builder", emoji: "\u{1F9A0}", href: "/arcade" },
  };
  const game = gameLinks[content.gameId];

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="rounded-3xl glass p-8">
        <div className="text-6xl">{game?.emoji ?? "\u{1F3AE}"}</div>
        <h3 className="mt-4 font-display text-xl font-bold text-cloud">{game?.name ?? "Mini-game"}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cloud-muted">{content.intro}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button href={game?.href ?? "/arcade"} className="w-full">
          Go to Arcade
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        <button
          onClick={onComplete}
          className="rounded-full bg-white/5 px-5 py-2.5 font-display font-semibold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
        >
          {completed ? "Completed!" : "I've played the game (+80 XP)"}
        </button>
      </div>
    </div>
  );
}
