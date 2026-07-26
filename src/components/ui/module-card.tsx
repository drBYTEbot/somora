import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SomoraModule } from "@/config/modules";
import { StatusBadge } from "./status-badge";
import { Icon } from "@/components/icons/icon";

export function ModuleCard({
  module,
  index = 0,
}: {
  module: SomoraModule;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        href={module.href}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-4xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:ring-1",
          module.ring,
        )}
      >
        <div
          className={cn(
            "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40",
            module.gradient,
          )}
        />
        <div className="relative mb-5 flex items-center justify-between">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-glow",
              module.gradient,
              module.glow,
            )}
          >
            <Icon name={module.icon as any} className="h-6 w-6 text-white" />
          </div>
          <StatusBadge status={module.status} />
        </div>
        <div className="relative">
          <h3 className="font-display text-xl font-semibold text-cloud">
            {module.name}
          </h3>
          <p className={cn("mt-1 text-sm font-medium", module.text)}>
            {module.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cloud-muted">
            {module.description}
          </p>
        </div>
        <div className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold text-cloud">
          Enter
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
