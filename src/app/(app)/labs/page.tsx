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
  trainModel,
  predictGrid,
  type TrainingMetrics,
} from "@/lib/ml";

const experiments = [
  { id: "image-classifier", name: "Image Classification", emoji: "\u{1F4F7}", desc: "Label images and watch the model improve in real time.", gradient: "from-emerald-500 to-teal-600", tags: ["Vision", "Training"] },
  { id: "text-classifier", name: "Text Classification", emoji: "\u{1F4DD}", desc: "Train an AI to recognize spam, sentiment, and intent.", gradient: "from-sky-500 to-blue-600", tags: ["NLP", "Text"] },
  { id: "object-detection", name: "Object Detection", emoji: "\u{1F50E}", desc: "Draw bounding boxes and teach AI to find multiple objects.", gradient: "from-orange-500 to-red-600", tags: ["Vision", "Boxes"] },
  { id: "voice-recognition", name: "Voice Recognition", emoji: "\u{1F3A4}", desc: "Record commands and train AI to recognize your voice.", gradient: "from-violet-500 to-indigo-600", tags: ["Audio", "On-device"] },
  { id: "gesture-recognition", name: "Gesture Recognition", emoji: "\u{1F91A}", desc: "Use your webcam to train AI on hand gestures, privately.", gradient: "from-fuchsia-500 to-purple-600", tags: ["Vision", "Privacy"] },
  { id: "recommendation", name: "Recommendation Engine", emoji: "\u{1F3AF}", desc: "Teach AI your taste and watch it recommend the perfect thing.", gradient: "from-cyan-500 to-teal-600", tags: ["Ranking", "Similarity"] },
];

export default function LabsPage() {
  const { addXP, unlockAchievement } = useStore();
  const [datasetSize, setDatasetSize] = useState(50);
  const [epochs, setEpochs] = useState(15);
  const [noise, setNoise] = useState(3);
  const [bias, setBias] = useState(0);
  const [learningRate, setLearningRate] = useState(3);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [grid, setGrid] = useState<{ x: number; y: number; pred: number }[]>([]);
  const [finalAccuracy, setFinalAccuracy] = useState(0);

  const modelRef = useRef<{ dispose: () => void } | null>(null);

  const cleanUp = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.dispose();
      modelRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanUp(), [cleanUp]);

  async function train() {
    setTraining(true);
    setMetrics([]);
    setCurrentEpoch(0);
    setGrid([]);
    cleanUp();

    try {
      // Build model with configurable architecture
      const model = buildModel({
        layers: [8, 6, 4],
        learningRate: learningRate / 100,
      });
      modelRef.current = model;

      // Generate dataset
      const { xs, ys } = generateDataset(datasetSize, noise, bias);

      // Train
      await trainModel(model, xs, ys, epochs, (m) => {
        setMetrics((prev) => [...prev, m]);
        setCurrentEpoch(m.epoch);
      });

      // Get predictions for visualization
      const gridPreds = predictGrid(model, 20);
      setGrid(gridPreds);

      const lastMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
      // Use the actual final metric from the training callback
      setMetrics((prev) => {
        if (prev.length > 0) {
          setFinalAccuracy(prev[prev.length - 1].accuracy);
        }
        return prev;
      });

      // Award XP for training a model
      addXP(40);
      unlockAchievement("data-wizard");

      // Cleanup tensors
      xs.dispose();
      ys.dispose();
    } catch (err) {
      console.error("Training failed:", err);
    } finally {
      setTraining(false);
    }
  }

  const acc = finalAccuracy * 100;
  const loss = metrics.length > 0 ? metrics[metrics.length - 1].loss : 0;

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Labs"
        title="Real ML playground"
        description="This is a real neural network powered by TensorFlow.js. Adjust the parameters and train it live in your browser. Every metric is real."
        center
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="rounded-4xl glass-strong p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-cloud">Configuration</h2>
          <p className="mt-1 text-sm text-cloud-muted">Tune the hyperparameters and watch how they affect learning.</p>

          <div className="mt-6 space-y-5">
            <Slider label="Dataset size" value={datasetSize} min={20} max={200} suffix=" samples" onChange={setDatasetSize} />
            <Slider label="Training epochs" value={epochs} min={5} max={50} suffix="x" onChange={setEpochs} />
            <Slider label="Data noise" value={noise} min={0} max={15} suffix="" onChange={setNoise} />
            <Slider label="Data bias" value={bias} min={-10} max={10} suffix="" onChange={setBias} />
            <Slider label="Learning rate" value={learningRate} min={1} max={20} suffix="" display={(v) => `${(v / 100).toFixed(3)}`} onChange={setLearningRate} />
          </div>

          <button
            onClick={train}
            disabled={training}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet px-6 py-3 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
          >
            {training ? `Training epoch ${currentEpoch}/${epochs}...` : "Train model"}
          </button>

          {training && (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet"
                animate={{ width: `${(currentEpoch / epochs) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="rounded-4xl glass p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-cloud">Live training results</h2>
          <p className="mt-1 text-sm text-cloud-muted">Real metrics from TensorFlow.js. No simulations.</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-night-950/40 p-4 text-center">
              <p className="text-xs text-cloud-dim">Accuracy</p>
              <p className={cn("font-display text-2xl font-bold", acc >= 80 ? "text-aurora-teal" : acc >= 50 ? "text-aurora-amber" : metrics.length > 0 ? "text-aurora-rose" : "text-cloud-dim")}>
                {metrics.length > 0 ? `${Math.round(acc)}%` : "\u2014"}
              </p>
            </div>
            <div className="rounded-2xl bg-night-950/40 p-4 text-center">
              <p className="text-xs text-cloud-dim">Loss</p>
              <p className="font-display text-2xl font-bold text-cloud">
                {metrics.length > 0 ? loss.toFixed(3) : "\u2014"}
              </p>
            </div>
            <div className="rounded-2xl bg-night-950/40 p-4 text-center">
              <p className="text-xs text-cloud-dim">Epoch</p>
              <p className="font-display text-2xl font-bold text-cloud">
                {currentEpoch}/{epochs}
              </p>
            </div>
          </div>

          {/* Loss/Accuracy chart */}
          {metrics.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Training progress</p>
              <div className="flex items-end justify-between gap-1" style={{ height: 100 }}>
                {metrics.map((m, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-aurora-teal/40 to-aurora-teal/80"
                      style={{ height: `${Math.max(2, m.accuracy * 80)}px` }}
                      title={`Epoch ${m.epoch}: ${(m.accuracy * 100).toFixed(1)}% acc, ${m.loss.toFixed(3)} loss`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-cloud-dim">
                <span>Epoch 1</span>
                <span>Epoch {epochs}</span>
              </div>
            </div>
          )}

          {/* Decision boundary visualization */}
          {grid.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Decision boundary (what the AI learned)</p>
              <div className="grid grid-cols-20 gap-px rounded-2xl overflow-hidden" style={{ gridTemplateColumns: "repeat(20, 1fr)" }}>
                {grid.map((cell, i) => (
                  <div
                    key={i}
                    className="aspect-square"
                    style={{
                      backgroundColor: `rgba(${cell.pred > 0.5 ? "45, 212, 191" : "167, 139, 250"}, ${cell.pred > 0.5 ? cell.pred : 1 - cell.pred})`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-cloud-dim">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-aurora-violet" /> Class A</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-aurora-teal" /> Class B</span>
              </div>
            </div>
          )}

          {metrics.length === 0 && !training && (
            <div className="mt-6 py-8 text-center">
              <div className="text-4xl opacity-20">{"\u{1F9E0}"}</div>
              <p className="mt-3 text-sm text-cloud-dim">Configure parameters and press Train to build a real neural network.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-4xl glass p-6">
        <h2 className="mb-3 font-display text-lg font-bold text-cloud">What&apos;s happening?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-aurora-teal">Neural Network</p>
            <p className="mt-1 text-sm text-cloud-muted">A 3-layer dense network (8-6-4 neurons) with ReLU activations and sigmoid output.</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-aurora-violet">Binary Classification</p>
            <p className="mt-1 text-sm text-cloud-muted">Two clusters of 2D points. The model learns to separate them with a non-linear boundary.</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-aurora-amber">Adam Optimizer</p>
            <p className="mt-1 text-sm text-cloud-muted">Adaptive learning rate optimization. Binary crossentropy loss measures how wrong predictions are.</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-aurora-rose">Try This</p>
            <p className="mt-1 text-sm text-cloud-muted">Increase noise to 10+ and watch accuracy drop. Add bias to skew the data. Lower the learning rate to 0.01.</p>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <SectionHeader eyebrow="More experiments" title="Try a real experiment" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-4xl glass p-6 transition-all hover:-translate-y-1"
            >
              <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", e.gradient)} />
              <div className={cn("relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", e.gradient)}>
                <span aria-hidden="true">{e.emoji}</span>
              </div>
              <h3 className="relative mt-3 font-display text-lg font-semibold text-cloud">{e.name}</h3>
              <p className="relative mt-1 text-sm text-cloud-muted">{e.desc}</p>
              <div className="relative mt-3 flex gap-1.5">
                {e.tags.map((t) => <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-cloud-dim">{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, suffix, display, onChange }: { label: string; value: number; min: number; max: number; suffix: string; display?: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-cloud-muted">{label}</span>
        <span className="font-semibold text-cloud">{display ? display(value) : `${value}${suffix}`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-aurora-violet"
      />
    </div>
  );
}
