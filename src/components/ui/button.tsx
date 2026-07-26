import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet text-night-950 hover:shadow-glow hover:shadow-aurora-violet/40",
  ghost: "text-cloud hover:bg-white/5",
  outline:
    "border border-white/15 text-cloud hover:border-white/30 hover:bg-white/5",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display font-semibold tracking-wide transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls} {...(props as object)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(props as object)}>
      {children}
    </button>
  );
}
