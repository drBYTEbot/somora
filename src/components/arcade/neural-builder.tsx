"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Neuron {
  id: number;
  layer: number;
  x: number;
  y: number;
}

const LAYOUT = [
  { count: 3, x: 15 },
  { count: 4, x: 45 },
  { count: 3, x: 75 },
  { count: 1, x: 95 },
];

export function NeuralBuilder() {
  const { recordGamePlay, addXP } = useStore();
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [trained, setTrained] = useState(false);
  const [score, setScore] = useState(0);

  const neurons: Neuron[] = [];
  LAYOUT.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const y = ((i + 1) / (layer.count + 1)) * 80 + 10;
      neurons.push({ id: li * 10 + i, layer: li, x: layer.x, y });
    }
  });

  const totalPossible = LAYOUT.slice(0, -1).reduce((sum, layer, i) => sum + layer.count * LAYOUT[i + 1].count, 0);

  function toggleConnection(from: number, to: number) {
    const key = `${from}-${to}`;
    setConnections((c) => {
      const next = { ...c, [key]: !c[key] };
      const count = Object.values(next).filter(Boolean).length;
      setScore(count);
      return next;
    });
  }

  function sendSignal() {
    setTrained(true);
    const connected = Object.values(connections).filter(Boolean).length;
    recordGamePlay("neural-builder", connected);
    addXP(40);
  }

  function reset() {
    setConnections({});
    setTrained(false);
    setScore(0);
  }

  function connectAll() {
    const all: Record<string, boolean> = {};
    neurons.forEach((from) => {
      neurons
        .filter((to) => to.layer === from.layer + 1)
        .forEach((to) => {
          all[`${from.id}-${to.id}`] = true;
        });
    });
    setConnections(all);
    setScore(Object.values(all).filter(Boolean).length);
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-cloud">Build a Neural Network</h3>
          <p className="text-sm text-cloud-muted">Click the lines to connect neurons. Then send a signal!</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-aurora-violet">{score}</p>
          <p className="text-xs text-cloud-dim">connections</p>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden rounded-3xl bg-night-950/40">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Connection lines with invisible hit areas */}
          {neurons.map((from) =>
            neurons
              .filter((to) => to.layer === from.layer + 1)
              .map((to) => {
                const key = `${from.id}-${to.id}`;
                const active = connections[key];
                return (
                  <g key={key}>
                    {/* Visible line */}
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={active ? "#a78bfa" : "rgba(255,255,255,0.12)"}
                      strokeWidth={active ? "0.8" : "0.5"}
                      strokeLinecap="round"
                      pointerEvents="none"
                    />
                    {/* Animated signal dot */}
                    {active && trained && (
                      <motion.circle
                        r="0.9"
                        fill="#5eead4"
                        initial={{ cx: from.x, cy: from.y }}
                        animate={{ cx: to.x, cy: to.y }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                        pointerEvents="none"
                      />
                    )}
                    {/* Invisible wide hit area for clicking */}
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="transparent"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="cursor-pointer"
                      onClick={() => toggleConnection(from.id, to.id)}
                    />
                  </g>
                );
              }),
          )}
          {/* Neurons */}
          {neurons.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x} cy={n.y} r="3.5"
                fill={n.layer === 0 ? "#2dd4bf" : n.layer === LAYOUT.length - 1 ? "#fcd34d" : "#a78bfa"}
                className="transition-all"
                pointerEvents="none"
              />
              <text x={n.x} y={n.y + 1} textAnchor="middle" fontSize="2.5" fill="#0c0820" fontWeight="bold" pointerEvents="none">
                {n.layer === 0 ? "I" : n.layer === LAYOUT.length - 1 ? "O" : ""}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute left-2 top-2 text-[10px] text-cloud-dim">Input</div>
        <div className="absolute right-2 top-2 text-[10px] text-cloud-dim">Output</div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button onClick={sendSignal} disabled={score === 0} className="flex-1">
          {trained ? "Send another signal!" : "Send signal!"}
        </Button>
        {score === 0 ? (
          <button onClick={connectAll} className="rounded-full bg-white/5 px-4 py-2.5 text-sm font-semibold text-cloud-muted ring-1 ring-white/10 hover:bg-white/10">
            Connect all
          </button>
        ) : (
          <button onClick={reset} className="rounded-full bg-white/5 px-4 py-2.5 text-sm font-semibold text-cloud-muted ring-1 ring-white/10 hover:bg-white/10">
            Reset
          </button>
        )}
      </div>

      {trained && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-aurora-violet/10 p-4 text-sm text-aurora-violet">
          <p className="font-semibold">Signal sent!</p>
          <p className="mt-1 text-cloud-muted">Your network has {score} connections. The signal flowed from input to output through your neurons!</p>
        </motion.div>
      )}

      <p className="mt-3 text-center text-xs text-cloud-dim">
        {score >= totalPossible * 0.7 ? "Amazing! Your network is well connected." : `Connect more neurons for a stronger network! (${score}/${totalPossible} possible)`}
      </p>
    </div>
  );
}
