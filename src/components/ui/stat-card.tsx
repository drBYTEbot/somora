import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  sub,
  gradient = "from-aurora-teal/20 to-aurora-violet/10",
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      className="relative overflow-hidden rounded-3xl glass p-5"
    >
      <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl", gradient)} />
      <div className="relative flex items-center gap-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg", gradient)}>
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-cloud-dim">{label}</p>
          <p className="font-display text-2xl font-bold text-cloud">{value}</p>
        </div>
      </div>
      {sub && <p className="relative mt-2 text-xs text-cloud-muted">{sub}</p>}
    </motion.div>
  );
}
