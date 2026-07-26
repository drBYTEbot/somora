"use client";

import { cn } from "@/lib/utils";
import { worlds } from "@/config/worlds";
import { Starfield } from "@/components/visual/starfield";
import { WorldIsland } from "./world-island";

export function WorldMap({
  className,
  height = "h-[560px]",
}: {
  className?: string;
  height?: string;
}) {
  const ordered = [...worlds].sort((a, b) => a.order - b.order);
  const points = ordered.map((w) => `${w.x},${w.y}`).join(" ");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-5xl glass",
        height,
        className,
      )}
    >
      <Starfield />

      <div className="pointer-events-none absolute -left-24 top-6 h-64 w-64 rounded-full bg-aurora-violet/20 blur-3xl animate-aurora" />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-aurora-teal/15 blur-3xl animate-aurora"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-aurora-amber/10 blur-3xl animate-aurora"
        style={{ animationDelay: "6s" }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="somora-path" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#somora-path)"
          strokeWidth="0.5"
          strokeDasharray="1.4 1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {ordered.map((w, i) => (
        <WorldIsland key={w.id} world={w} index={i} />
      ))}
    </div>
  );
}
