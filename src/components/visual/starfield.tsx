import { cn } from "@/lib/utils";

type Star = {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

function seeded(n: number, seed: number) {
  const x = Math.sin(n * 99.13 + seed * 17.7) * 43758.5453;
  return x - Math.floor(x);
}

const STARS: Star[] = Array.from({ length: 64 }, (_, i) => {
  const top = seeded(i + 1, 1) * 100;
  const left = seeded(i + 1, 2) * 100;
  const size = 1 + Math.floor(seeded(i + 1, 3) * 2.4);
  return {
    top: `${top.toFixed(2)}%`,
    left: `${left.toFixed(2)}%`,
    size,
    delay: `${(seeded(i + 1, 4) * 5).toFixed(2)}s`,
    duration: `${(3 + seeded(i + 1, 5) * 4).toFixed(2)}s`,
    opacity: 0.4 + seeded(i + 1, 6) * 0.6,
  };
});

export function Starfield({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
