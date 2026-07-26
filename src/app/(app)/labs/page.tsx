"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

const experiments = [
  { id: "image-classifier", name: "Image Classification", emoji: "\u{1F4F7}", desc: "Label images and watch the model improve in real time.", gradient: "from-emerald-500 to-teal-600", tags: ["Vision", "Training"] },
  { id: "text-classifier", name: "Text Classification", emoji: "\u{1F4DD}", desc: "Train an AI to recognize spam, sentiment, and intent.", gradient: "from-sky-500 to-blue-600", tags: ["NLP", "Text"] },
  { id: "object-detection", name: "Object Detection", emoji: "\u{1F50E}", desc: "Draw bounding boxes and teach AI to find multiple objects.", gradient: "from-orange-500 to-red-600", tags: ["Vision", "Boxes"] },
  { id: "voice-recognition", name: "Voice Recognition", emoji: "\u{1F3A4}", desc: "Record commands and train AI to recognize your voice.", gradient: "from-violet-500 to-indigo-600", tags: ["Audio", "On-device"] },
  { id: "gesture-recognition", name: "Gesture Recognition", emoji: "\u{1F91A}", desc: "Use your webcam to train AI on hand gestures, privately.", gradient: "from-fuchsia-500 to-purple-600", tags: ["Vision", "Privacy"] },
  { id: "recommendation", name: "Recommendation Engine", emoji: "\u{1F3AF}", desc: "Teach AI your taste and watch it recommend the perfect thing.", gradient: "from-cyan-500 to-teal-600", tags: ["Ranking", "Similarity"] },
];

export default function LabsPage() {
  const [datasetSize, setDatasetSize] = useState(50);
  const [epochs, setEpochs] = useState(10);
  const [noise, setNoise] = useState(5);
  const [bias, setBias] = useState(0);
  const [training, setTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const acc = Math.min(99, 40 + datasetSize * 0.4 + epochs * 1.2 - noise * 2 - Math.abs(bias) * 1.5);

  function train() {
    setTraining(true);
    setAccuracy(0);
    const target = Math.round(acc);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.max(1, Math.round((target - current) * 0.2));
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setTraining(false);
      }
      setAccuracy(current);
    }, 80);
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Labs"
        title="Hands-on AI experiments"
        description="Safely explore computer vision, NLP, speech, and neural networks. Everything is visual, interactive, and runs right in your browser."
        center
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-4xl glass-strong p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-cloud">ML Playground</h2>
          <p className="mt-1 text-sm text-cloud-muted">Change the variables and watch how the model&apos;s accuracy responds.</p>

          <div className="mt-6 space-y-5">
            <Slider label="Dataset size" value={datasetSize} min={10} max={100} suffix=" examples" onChange={setDatasetSize} />
            <Slider label="Training epochs" value={epochs} min={1} max={30} suffix="x" onChange={setEpochs} />
            <Slider label="Data noise" value={noise} min={0} max={20} suffix="%" onChange={setNoise} />
            <Slider label="Data bias" value={bias} min={-20} max={20} suffix="" onChange={setBias} />
          </div>

          <button
            onClick={train}
            disabled={training}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet px-6 py-3 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 disabled:opacity-50 active:scale-95"
          >
            {training ? "Training..." : "Train model"}
          </button>

          <div className="mt-6 rounded-3xl bg-night-950/40 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Model accuracy</p>
            <p className={cn("font-display text-5xl font-bold", accuracy >= 80 ? "text-aurora-teal" : accuracy >= 50 ? "text-aurora-amber" : "text-aurora-rose")}>
              {accuracy}%
            </p>
            <div className="mx-auto mt-3 h-3 max-w-xs overflow-hidden rounded-full bg-white/5">
              <motion.div
                className={cn("h-full rounded-full", accuracy >= 80 ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf" : accuracy >= 50 ? "bg-gradient-to-r from-aurora-amber to-aurora-rose" : "bg-aurora-rose/60")}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-3 text-xs text-cloud-dim">
              {accuracy === 0 && "Press 'Train model' to start."}
              {accuracy > 0 && accuracy < 50 && "Low accuracy. Try more data or less noise."}
              {accuracy >= 50 && accuracy < 80 && "Getting better. Add more examples!"}
              {accuracy >= 80 && "Excellent! This model is learning well."}
            </p>
          </div>
        </div>

        <div className="rounded-4xl glass p-6 lg:p-8">
          <h2 className="font-display text-xl font-bold text-cloud">Model visualization</h2>
          <p className="mt-1 text-sm text-cloud-muted">Neurons light up while learning. This is what&apos;s happening inside.</p>

          <div className="mt-6 flex items-center justify-center gap-3 py-8">
            {[3, 5, 4, 2].map((count, layer) => (
              <div key={layer} className="flex flex-col gap-3">
                {Array.from({ length: count }).map((_, n) => (
                  <div
                    key={n}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-300",
                      training ? "bg-aurora-violet shadow-glow shadow-aurora-violet/60 animate-pulse" : accuracy > 0 ? "bg-aurora-teal/70" : "bg-white/10",
                    )}
                    style={{ transitionDelay: `${(layer * count + n) * 50}ms` }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cloud-muted">Layers</span><span className="font-semibold text-cloud">4</span></div>
            <div className="flex justify-between"><span className="text-cloud-muted">Parameters</span><span className="font-semibold text-cloud">{(datasetSize * epochs * 12).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-cloud-muted">Loss</span><span className="font-semibold text-cloud">{((100 - accuracy) / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-cloud-muted">Status</span><span className={cn("font-semibold", training ? "text-aurora-violet" : accuracy > 0 ? "text-aurora-teal" : "text-cloud-dim")}>{training ? "Training..." : accuracy > 0 ? "Trained" : "Idle"}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <SectionHeader eyebrow="Experiments" title="Try a real experiment" />
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

function Slider({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-cloud-muted">{label}</span>
        <span className="font-semibold text-cloud">{value}{suffix}</span>
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
