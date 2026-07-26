"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import {
  buildModel,
  generateDataset,
  pointsToTensors,
  splitData,
  trainOneEpoch,
  predictGrid,
  predictPoint,
  evaluateAccuracy,
  type DataPoint,
} from "@/lib/ml";

type Diff = "easy" | "medium" | "hard";
type TFModel = ReturnType<typeof buildModel>;

interface Prediction {
  x: number;
  y: number;
  pred: number;
}

const VIZ_RANGE = 7;
const GRID_RESOLUTION = 20;

const configs: Record<
  Diff,
  {
    samples: number;
    epochs: number;
    noise: number;
    separation: number;
    label: string;
    emoji: string;
    desc: string;
    expected: string;
    dataLesson: string;
  }
> = {
  easy: {
    samples: 80,
    epochs: 10,
    noise: 2,
    separation: 3,
    label: "Easy",
    emoji: "\u{1F331}",
    desc: "Clear groups. The brain should nail this!",
    expected: "90-100%",
    dataLesson:
      "See how the purple and green dots are in clear, separate groups? The brain should be able to draw a line between them easily!",
  },
  medium: {
    samples: 60,
    epochs: 10,
    noise: 6,
    separation: 2,
    label: "Medium",
    emoji: "\u26A1",
    desc: "Some overlap. A bit tricky!",
    expected: "70-85%",
    dataLesson:
      "The dots overlap a bit here! Some purple dots are hanging out near green dots. The brain will have to work harder to find the pattern.",
  },
  hard: {
    samples: 40,
    epochs: 10,
    noise: 10,
    separation: 1.5,
    label: "Hard",
    emoji: "\u{1F525}",
    desc: "Super messy! Good luck, brain!",
    expected: "55-70%",
    dataLesson:
      "Wow, the dots are ALL mixed up! Purple and green dots are everywhere. How is the brain supposed to tell them apart? This is going to be tough!",
  },
};

const TAKEAWAY =
  "What you just did is called MACHINE LEARNING! Instead of programming rules by hand, you gave the computer EXAMPLES and it found the patterns on its own. This is how real AI works \u2014 Netflix learns your taste from what you watch, phones learn your face, and self-driving cars learn to see the road. All from examples!";

function toPercent(val: number): number {
  return Math.max(0, Math.min(100, ((val + VIZ_RANGE) / (VIZ_RANGE * 2)) * 100));
}

function DataViz({
  points,
  grid,
  prediction,
  onClick,
}: {
  points: DataPoint[];
  grid?: { pred: number }[];
  prediction?: Prediction | null;
  onClick?: (x: number, y: number) => void;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-2xl bg-night-950/60 ring-1 ring-white/10",
        onClick && "cursor-crosshair",
      )}
      onClick={
        onClick
          ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width;
              const py = (e.clientY - rect.top) / rect.height;
              const x = px * VIZ_RANGE * 2 - VIZ_RANGE;
              const y = py * VIZ_RANGE * 2 - VIZ_RANGE;
              onClick(x, y);
            }
          : undefined
      }
    >
      {grid && grid.length > 0 && (
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${GRID_RESOLUTION}, 1fr)` }}
        >
          {grid.map((cell, i) => (
            <div
              key={i}
              style={{
                backgroundColor:
                  cell.pred > 0.5
                    ? `rgba(45, 212, 191, ${cell.pred * 0.45})`
                    : `rgba(167, 139, 250, ${(1 - cell.pred) * 0.45})`,
              }}
            />
          ))}
        </div>
      )}

      {points.map((p, i) => (
        <div
          key={i}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/40"
          style={{
            left: `${toPercent(p.x)}%`,
            top: `${toPercent(p.y)}%`,
            backgroundColor: p.label === 0 ? "#a78bfa" : "#2dd4bf",
          }}
        />
      ))}

      {prediction && (
        <div
          className="absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full ring-2 ring-white"
          style={{
            left: `${toPercent(prediction.x)}%`,
            top: `${toPercent(prediction.y)}%`,
            backgroundColor: prediction.pred > 0.5 ? "#2dd4bf" : "#a78bfa",
          }}
        />
      )}
    </div>
  );
}

function getResultMessage(
  diff: Diff,
  acc: number,
): { title: string; emoji: string; explanation: string } {
  if (acc >= 85) {
    return {
      title: "The brain is a genius!",
      emoji: "\u{1F3C6}",
      explanation:
        diff === "easy"
          ? "The brain nailed it! When data is in clear groups, AI finds the pattern easily. This is why AI is great at sorting things \u2014 like telling cats from dogs in photos!"
          : "Wow, the brain did really well! Even with some messy data, it found the pattern. Real AI works like this too \u2014 it's not perfect, but it finds the important patterns.",
    };
  }
  if (acc >= 65) {
    return {
      title: "The brain learned something!",
      emoji: "\u{1F4AA}",
      explanation:
        "Not bad! The brain found the pattern, but it's not perfect. Some dots ended up in the wrong zone. In real life, this is like a spam filter \u2014 it catches most spam, but some slip through. No AI is 100% perfect!",
    };
  }
  return {
    title: "The brain is confused!",
    emoji: "\u{1F914}",
    explanation:
      "Ouch! The brain struggled with this one. When data is all mixed up, even AI can't find a clear pattern. This is the #1 rule of AI: you need GOOD data to get GOOD results. Bad data = bad AI!",
  };
}

export default function LabsPage() {
  const { addXP, unlockAchievement } = useStore();
  const [step, setStep] = useState(0);
  const [difficulty, setDifficulty] = useState<Diff>("easy");
  const [training, setTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [testAccuracy, setTestAccuracy] = useState(0);
  const [grid, setGrid] = useState<{ pred: number }[]>([]);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const modelRef = useRef<TFModel | null>(null);
  const dataRef = useRef<{ train: DataPoint[]; test: DataPoint[] } | null>(null);
  const cancelledRef = useRef(false);

  const cleanUp = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.dispose();
      modelRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      cleanUp();
    };
  }, [cleanUp]);

  function generateData(diff: Diff) {
    setPrediction(null);
    setGrid([]);

    const { xs, ys, points: pts } = generateDataset(
      configs[diff].samples,
      configs[diff].noise,
      configs[diff].separation,
    );
    xs.dispose();
    ys.dispose();
    setPoints(pts);
    const { train, test } = splitData(pts, 0.7);
    dataRef.current = { train, test };
  }

  function selectDifficulty(key: Diff) {
    setDifficulty(key);
    generateData(key);
  }

  async function train() {
    if (!dataRef.current) return;
    const cfg = configs[difficulty];
    cancelledRef.current = false;
    setStep(1);
    setTraining(true);
    setCurrentEpoch(0);
    setTestAccuracy(0);
    setGrid([]);
    setPrediction(null);
    cleanUp();

    try {
      const model = buildModel({ layers: [6, 4], learningRate: 0.03 });
      modelRef.current = model;

      const { train: trainPts, test: testPts } = dataRef.current;
      const trainTensors = pointsToTensors(trainPts);
      const testTensors = pointsToTensors(testPts);

      for (let i = 0; i < cfg.epochs; i++) {
        if (cancelledRef.current) break;

        await trainOneEpoch(model, trainTensors.xs, trainTensors.ys);
        const acc = evaluateAccuracy(model, testTensors.xs, testTensors.ys);
        setCurrentEpoch(i + 1);
        setTestAccuracy(acc);

        const preds = predictGrid(model, GRID_RESOLUTION, VIZ_RANGE);
        setGrid(preds);

        await new Promise((r) => setTimeout(r, 350));
      }

      trainTensors.xs.dispose();
      trainTensors.ys.dispose();
      testTensors.xs.dispose();
      testTensors.ys.dispose();
      addXP(40);
      unlockAchievement("data-wizard");
    } catch {
      // ignore
    } finally {
      if (!cancelledRef.current) {
        setTraining(false);
        setStep(2);
      }
    }
  }

  function handleVizClick(x: number, y: number) {
    if (!modelRef.current) return;
    const pred = predictPoint(modelRef.current, x, y);
    setPrediction({ x, y, pred });
  }

  function tryAgain() {
    cleanUp();
    setCurrentEpoch(0);
    setTestAccuracy(0);
    setGrid([]);
    setPrediction(null);
    setStep(0);
    generateData(difficulty);
  }

  function tryDifferent() {
    cleanUp();
    setCurrentEpoch(0);
    setTestAccuracy(0);
    setGrid([]);
    setPoints([]);
    setPrediction(null);
    dataRef.current = null;
    setStep(0);
  }

  const acc = Math.round(testAccuracy * 100);
  const cfg = configs[difficulty];
  const result = getResultMessage(difficulty, acc);

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Labs"
        title="Teach a computer to think!"
        description="Train a real AI brain! Pick a challenge, watch it learn step by step, then test it yourself!"
        center
      />

      <div className="mx-auto mt-10 max-w-2xl">
        {/* Step 0: Pick difficulty + see the data */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-center font-display text-xl font-bold text-cloud">
              Pick your challenge!
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {(["easy", "medium", "hard"] as const).map((key) => {
                const c = configs[key];
                return (
                  <button
                    key={key}
                    onClick={() => selectDifficulty(key)}
                    className={cn(
                      "rounded-4xl p-6 text-center transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-violet/50",
                      difficulty === key
                        ? "glass-strong ring-2 ring-aurora-violet/50"
                        : "glass hover:bg-white/[0.06]",
                    )}
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <p className="mt-2 font-display text-lg font-bold text-cloud">
                      {c.label}
                    </p>
                    <p className="mt-1 text-xs text-cloud-muted">{c.desc}</p>
                    <p className="mt-2 text-[10px] text-cloud-dim">
                      Goal: {c.expected} accuracy
                    </p>
                  </button>
                );
              })}
            </div>

            {points.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="rounded-3xl glass p-5">
                  <p className="text-sm text-cloud-muted">{cfg.dataLesson}</p>
                </div>

                <DataViz points={points} />

                <div className="flex items-center justify-center gap-4 text-xs text-cloud-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#a78bfa]" />
                    Purple group
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2dd4bf]" />
                    Green group
                  </span>
                </div>

                <Button onClick={train} className="w-full">
                  Start training! {"\u26A1"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 1: Watch it learn */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-4xl glass-strong p-6 text-center">
              <motion.div
                animate={training ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={
                  training ? { duration: 0.5, repeat: Infinity } : {}
                }
                className="text-6xl"
              >
                {"\u{1F9E0}"}
              </motion.div>
              <p className="mt-2 font-display text-lg font-bold text-cloud">
                {training ? "The brain is learning!" : "All done!"}
              </p>
              {training && (
                <p className="text-sm text-cloud-muted">
                  Lesson {currentEpoch} of {cfg.epochs} {"\u00B7"} studying{" "}
                  {dataRef.current?.train.length ?? cfg.samples} examples
                </p>
              )}
            </div>

            <DataViz points={points} grid={grid} />

            <div className="rounded-3xl glass p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-cloud">
                  {training ? "Test accuracy on NEW data:" : "Final score:"}
                </span>
                <span
                  className={cn(
                    "font-display text-3xl font-bold transition-all",
                    acc >= 80
                      ? "text-aurora-teal"
                      : acc >= 50
                        ? "text-aurora-amber"
                        : "text-aurora-rose",
                  )}
                >
                  {acc}%
                </span>
              </div>
              <div className="h-5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    acc >= 80
                      ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf"
                      : acc >= 50
                        ? "bg-gradient-to-r from-aurora-amber to-aurora-rose"
                        : "bg-aurora-rose/60",
                  )}
                  animate={{ width: `${acc}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: cfg.epochs }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i < currentEpoch
                        ? "w-4 bg-aurora-violet"
                        : i === currentEpoch && training
                          ? "w-4 animate-pulse bg-aurora-violet/50"
                          : "w-2 bg-white/10",
                    )}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-cloud-dim">
                {training
                  ? "The brain looks at the dots and adjusts its thinking. Watch the colored background change \u2014 that's the brain's guess about where purple and green should be!"
                  : acc >= 80
                    ? "Amazing! The brain learned the pattern really well!"
                    : acc >= 50
                      ? "Not bad! The brain found something, but it's not perfect."
                      : "Oof! The brain is struggling with this messy data."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2: Test the brain */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-4xl glass-strong p-6 text-center">
              <div className="text-5xl">{"\u{1F916}"}</div>
              <h3 className="mt-2 font-display text-xl font-bold text-cloud">
                Test the brain yourself!
              </h3>
              <p className="mt-1 text-sm text-cloud-muted">
                Click anywhere on the map to ask the brain what it thinks!
              </p>
            </div>

            <DataViz
              points={points}
              grid={grid}
              prediction={prediction}
              onClick={handleVizClick}
            />

            {prediction ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl glass p-5 text-center"
              >
                <p className="text-sm text-cloud-dim">The brain says...</p>
                <p className="mt-1 font-display text-2xl font-bold text-cloud">
                  {prediction.pred > 0.5
                    ? "Green! \u{1F7E2}"
                    : "Purple! \u{1F7E3}"}
                </p>
                <p className="mt-1 text-sm text-cloud-muted">
                  It{"\u2019"}s{" "}
                  <span className="font-bold text-cloud">
                    {Math.round(
                      (prediction.pred > 0.5
                        ? prediction.pred
                        : 1 - prediction.pred) * 100,
                    )}
                    %
                  </span>{" "}
                  sure about that.
                </p>
              </motion.div>
            ) : (
              <div className="rounded-3xl glass p-4 text-center text-xs text-cloud-dim">
                {"\u{1F4A1}"} Tip: try clicking where the colors blend together
                {"\u2014"} that{"\u2019"}s where the brain is most unsure!
              </div>
            )}

            <Button onClick={() => setStep(3)} className="w-full">
              See what I learned {"\u2192"}
            </Button>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-4xl glass-strong p-8 text-center">
              <div className="text-7xl">{result.emoji}</div>
              <h3 className="mt-3 font-display text-2xl font-bold text-cloud">
                {result.title}
              </h3>
              <p className="mt-2 text-cloud-muted">
                It got{" "}
                <span className="font-bold text-aurora-teal">{acc}%</span> of{" "}
                <span className="font-semibold">NEW</span> answers right!
              </p>
              <p className="mt-1 text-xs text-cloud-dim">
                {cfg.label} difficulty {"\u00B7"} {cfg.samples} examples{" "}
                {"\u00B7"} {cfg.epochs} lessons
              </p>
            </div>

            <DataViz points={points} grid={grid} />

            <div className="rounded-3xl glass p-5 text-sm text-cloud-muted">
              <p className="font-semibold text-cloud">What happened?</p>
              <p className="mt-1">{result.explanation}</p>
            </div>

            <div className="rounded-3xl bg-aurora-violet/10 p-5 text-sm text-cloud-muted ring-1 ring-aurora-violet/20">
              <p className="font-semibold text-cloud">{"\u{1F4A1}"} Big idea</p>
              <p className="mt-1">{TAKEAWAY}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={tryAgain} className="flex-1">
                Try again!
              </Button>
              <Button
                onClick={tryDifferent}
                variant="outline"
                className="flex-1"
              >
                Try different
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
