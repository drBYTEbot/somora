"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

interface Car {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  lane: number;
}

const TRACK_WIDTH = 200;
const TRACK_HEIGHT = 400;
const CAR_SIZE = 30;
const LANE_WIDTH = TRACK_WIDTH / 3;

export function AutonomousCar() {
  const { recordGamePlay, addXP } = useStore();
  const [carLane, setCarLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [crashed, setCrashed] = useState(false);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [generation, setGeneration] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = useCallback((direction: -1 | 1) => {
    setCarLane((lane) => Math.max(0, Math.min(2, lane + direction)));
  }, []);

  useEffect(() => {
    if (!running) return;

    frameRef.current = setInterval(() => {
      setObstacles((prev) => {
        const moved = prev.map((o) => ({ ...o, y: o.y + 8 }));
        const filtered = moved.filter((o) => o.y < TRACK_HEIGHT);

        if (Math.random() < 0.15 + score * 0.002) {
          filtered.push({ x: 0, y: 0, lane: Math.floor(Math.random() * 3) });
        }

        return filtered;
      });

      setScore((s) => s + 1);

      if (mode === "ai") {
        setObstacles((current) => {
          const upcoming = current.filter((o) => o.y < 150 && o.y > 0);
          const dangerLane = upcoming.find((o) => o.lane === carLane && o.y < 150);
          if (dangerLane) {
            const safeLanes = [0, 1, 2].filter((l) => !upcoming.some((o) => o.lane === l && o.y < 100));
            if (safeLanes.length > 0) {
              const best = safeLanes.reduce((best, l) => Math.abs(l - carLane) < Math.abs(best - carLane) ? l : best, safeLanes[0]);
              setCarLane(best);
            }
          }
          return current;
        });
      }
    }, 60);

    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [running, score, mode, carLane]);

  useEffect(() => {
    if (!running) return;
    const crash = obstacles.some((o) => o.lane === carLane && o.y > TRACK_HEIGHT - CAR_SIZE - 20 && o.y < TRACK_HEIGHT - 10);
    if (crash) {
      setRunning(false);
      setCrashed(true);
      if (score > bestScore) setBestScore(score);
      recordGamePlay("autonomous-car", score);
    }
  }, [obstacles, carLane, running, score, bestScore, recordGamePlay]);

  function start() {
    setObstacles([]);
    setScore(0);
    setCrashed(false);
    setRunning(true);
    setCarLane(1);
  }

  function trainAI() {
    setMode("ai");
    setGeneration((g) => g + 1);
    start();
  }

  return (
    <div className="rounded-4xl glass-strong p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-cloud">Self-Driving Car</h3>
          <p className="text-sm text-cloud-muted">
            {mode === "manual" ? "Drive the car! Use buttons to switch lanes." : "AI is driving! Watch it learn."}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-aurora-amber">{score}</p>
          <p className="text-xs text-cloud-dim">score {mode === "ai" ? `Gen ${generation}` : ""}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative overflow-hidden rounded-3xl bg-night-950" style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}>
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/5" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/5" />

          {obstacles.map((o, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: o.lane * LANE_WIDTH + LANE_WIDTH / 2 - 12, top: o.y }}
            >
              {"\u{1F4A8}"}
            </motion.div>
          ))}

          <div
            className="absolute text-2xl transition-all duration-150"
            style={{ left: carLane * LANE_WIDTH + LANE_WIDTH / 2 - 12, top: TRACK_HEIGHT - CAR_SIZE - 10 }}
          >
            {"\u{1F697}"}
          </div>

          {crashed && (
            <div className="absolute inset-0 flex items-center justify-center bg-night-950/70">
              <div className="text-center">
                <div className="text-4xl">{"\u{1F4A5}"}</div>
                <p className="mt-2 font-display text-lg font-bold text-aurora-rose">Crashed!</p>
                <p className="text-sm text-cloud-muted">Score: {score}</p>
              </div>
            </div>
          )}

          {!running && !crashed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-cloud-dim">Press Start!</p>
            </div>
          )}
        </div>
      </div>

      {mode === "manual" && running && (
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => move(-1)} className="rounded-2xl bg-white/5 px-6 py-3 text-xl ring-1 ring-white/10 active:scale-95 hover:bg-white/10">
            {"\u2190"}
          </button>
          <button onClick={() => move(1)} className="rounded-2xl bg-white/5 px-6 py-3 text-xl ring-1 ring-white/10 active:scale-95 hover:bg-white/10">
            {"\u2192"}
          </button>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        {!running && !crashed && (
          <Button onClick={start} className="flex-1">
            {mode === "manual" ? "Start driving!" : "Start AI!"}
          </Button>
        )}
        {crashed && mode === "manual" && (
          <Button onClick={trainAI} className="flex-1">
            Let AI try! {"\u{1F916}"}
          </Button>
        )}
        {crashed && mode === "ai" && (
          <Button onClick={trainAI} className="flex-1">
            Train again (Gen {generation + 1})
          </Button>
        )}
        {mode === "ai" && !crashed && !running && (
          <Button onClick={start} className="flex-1">Start AI driving</Button>
        )}
        {mode !== "manual" && (
          <button onClick={() => { setMode("manual"); start(); }} className="rounded-full bg-white/5 px-4 py-2.5 text-sm font-semibold text-cloud-muted ring-1 ring-white/10 hover:bg-white/10">
            Manual
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-cloud-dim">
        {mode === "manual" && "Tip: Switch lanes to dodge the wind!"}
        {mode === "ai" && "The AI learned from your driving! It watches for danger and switches lanes automatically."}
      </p>
    </div>
  );
}
