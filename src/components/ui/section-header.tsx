import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={cn(center && "text-center", "max-w-2xl", center && "mx-auto", className)}>
      {eyebrow && (
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-aurora-teal">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-3xl font-bold text-cloud sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-cloud-muted">{description}</p>
      )}
    </div>
  );
}
