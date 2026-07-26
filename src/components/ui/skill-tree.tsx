import { cn } from "@/lib/utils";
import { skillTree } from "@/config/progress";

const tierColors = [
  "from-aurora-teal to-aurora-leaf",
  "from-aurora-sky to-aurora-violet",
  "from-aurora-violet to-aurora-bloom",
  "from-aurora-amber to-aurora-rose",
  "from-aurora-bloom to-aurora-violet",
  "from-aurora-sun to-aurora-amber",
];

export function SkillTree() {
  const maxTier = Math.max(...skillTree.map((s) => s.tier));

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 sm:gap-6">
      {Array.from({ length: maxTier + 1 }, (_, tier) => {
        const nodes = skillTree.filter((s) => s.tier === tier);
        return (
          <div key={tier} className="flex shrink-0 flex-col items-center gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-cloud-dim">
              Tier {tier}
            </p>
            {nodes.map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-2xl text-2xl shadow-glow ring-1 transition-all duration-300",
                    node.unlocked
                      ? cn("bg-gradient-to-br ring-white/20", tierColors[tier % tierColors.length])
                      : "bg-white/[0.03] ring-white/5 grayscale opacity-40",
                  )}
                >
                  <span aria-hidden="true">{node.emoji}</span>
                  {!node.unlocked && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-night-900 text-cloud-dim ring-2 ring-night-950">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-2.5 w-2.5" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className={cn("mt-2 max-w-[5rem] text-center text-[10px] font-medium", node.unlocked ? "text-cloud" : "text-cloud-dim")}>
                  {node.name}
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
