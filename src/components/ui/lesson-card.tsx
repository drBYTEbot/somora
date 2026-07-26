import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";
import type { Lesson } from "@/config/curriculum";

const typeMeta: Record<Lesson["type"], { label: string; emoji: string }> = {
  story: { label: "Story", emoji: "\u{1F4D6}" },
  interactive: { label: "Interactive", emoji: "\u{1F4A1}" },
  "mini-game": { label: "Mini-game", emoji: "\u{1F3AE}" },
  quiz: { label: "Quiz", emoji: "\u2753" },
  challenge: { label: "Challenge", emoji: "\u{1F3C5}" },
};

export function LessonCard({ lesson, index, done }: { lesson: Lesson; index: number; done?: boolean }) {
  const meta = typeMeta[lesson.type];
  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-2xl glass p-4 transition-all duration-200 hover:bg-white/[0.06]",
        done && "opacity-90",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
          done
            ? "bg-aurora-teal/20 text-aurora-teal ring-1 ring-aurora-teal/30"
            : "bg-white/5 text-cloud-dim ring-1 ring-white/10",
        )}
      >
        {done ? <Icon name="star" className="h-4 w-4" /> : index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-cloud">{lesson.title}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-cloud-dim">
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
          <span>&middot;</span>
          <span>{lesson.duration}</span>
        </div>
      </div>
      {done ? (
        <span className="text-xs font-semibold text-aurora-teal">Done</span>
      ) : (
        <Icon name="chevron-right" className="h-4 w-4 text-cloud-dim transition-transform group-hover:translate-x-0.5" />
      )}
    </div>
  );
}
