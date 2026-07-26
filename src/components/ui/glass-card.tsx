import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  strong = false,
}: {
  className?: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-4xl shadow-inset",
        className,
      )}
    >
      {children}
    </div>
  );
}
