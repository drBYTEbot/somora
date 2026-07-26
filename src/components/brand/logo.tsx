import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="somora-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="7" fill="url(#somora-logo)" />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6"
        stroke="url(#somora-logo)"
        strokeWidth="1.6"
        transform="rotate(-25 16 16)"
      />
      <circle cx="27.5" cy="8.5" r="1.7" fill="#fcd34d" />
    </svg>
  );
}
