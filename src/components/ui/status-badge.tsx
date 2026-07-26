import { cn } from "@/lib/utils";
import type { ModuleStatus } from "@/config/modules";

export function StatusBadge({
  status,
  className,
}: {
  status: ModuleStatus;
  className?: string;
}) {
  const isLive = status === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
        isLive
          ? "bg-aurora-teal/15 text-aurora-teal ring-1 ring-aurora-teal/30"
          : "bg-white/5 text-cloud-dim ring-1 ring-white/10",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isLive ? "bg-aurora-teal animate-pulse" : "bg-cloud-dim/60",
        )}
      />
      {isLive ? "Live" : "Coming soon"}
    </span>
  );
}
