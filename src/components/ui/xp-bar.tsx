import { cn } from "@/lib/utils";

export function XPBar({
  value,
  max,
  className,
  showLabel = true,
}: {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-cloud-muted">{value.toLocaleString()} XP</span>
          <span className="text-cloud-dim">{max.toLocaleString()}</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-amber transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
