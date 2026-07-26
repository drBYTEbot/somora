"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";

const students = [
  { name: "Maya", emoji: "\u{1F9D1}\u{1F3FB}\u200D\u{1F393}", xp: 2840, streak: 12, progress: 65, status: "ahead", lastActive: "today" },
  { name: "Dev", emoji: "\u{1F468}\u{1F3FE}", xp: 1920, streak: 5, progress: 44, status: "on-track", lastActive: "today" },
  { name: "Aria", emoji: "\u{1F471}\u{1F3FB}\u200D\u2640", xp: 3210, streak: 18, progress: 72, status: "ahead", lastActive: "today" },
  { name: "Leo", emoji: "\u{1F466}\u{1F3FD}", xp: 890, streak: 0, progress: 20, status: "behind", lastActive: "2 days ago" },
  { name: "Priya", emoji: "\u{1F469}\u{1F3FF}", xp: 2400, streak: 8, progress: 55, status: "on-track", lastActive: "today" },
  { name: "Sam", emoji: "\u{1F466}\u{1F3FB}", xp: 1560, streak: 3, progress: 35, status: "on-track", lastActive: "yesterday" },
];

const assignments = [
  { title: "Train a classifier", world: "Data Forest", due: "Tomorrow", submitted: 4, total: 6 },
  { title: "Prompt engineering challenge", world: "Prompt Planet", due: "Fri", submitted: 2, total: 6 },
  { title: "Build a chatbot", world: "Robotics Harbor", due: "Next week", submitted: 1, total: 6 },
];

const statusMeta = {
  ahead: { label: "Ahead", color: "text-aurora-teal", bg: "bg-aurora-teal/15" },
  "on-track": { label: "On track", color: "text-aurora-sky", bg: "bg-aurora-sky/15" },
  behind: { label: "Needs support", color: "text-aurora-rose", bg: "bg-aurora-rose/15" },
};

export default function ClassPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Class"
        title="Teacher dashboard"
        description="Track classrooms, assign lessons, and see exactly where each student needs support."
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard index={0} icon={<span aria-hidden="true">{"\u{1F465}"}</span>} label="Students" value={students.length} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={1} icon={<span aria-hidden="true">{"\u{1F4DD}"}</span>} label="Assignments" value={assignments.length} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={2} icon={<span aria-hidden="true">{"\u2705"}</span>} label="Avg completion" value="68%" gradient="from-aurora-teal/20 to-aurora-leaf/10" />
        <StatCard index={3} icon={<span aria-hidden="true">{"\u{1F4C8}"}</span>} label="Class avg XP" value="2,137" gradient="from-aurora-amber/20 to-aurora-rose/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">Students</h2>
          <div className="space-y-3">
            {students.map((s, i) => {
              const meta = statusMeta[s.status as keyof typeof statusMeta];
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl glass p-4"
                >
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-cloud">{s.name}</p>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>{meta.label}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-cloud-dim">
                      <span>{s.xp.toLocaleString()} XP</span>
                      <span>{"\u00B7"}</span>
                      <span>{s.streak > 0 ? `${s.streak} day streak` : "No streak"}</span>
                      <span>{"\u00B7"}</span>
                      <span>Active {s.lastActive}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Assignments</h2>
            <div className="space-y-3">
              {assignments.map((a) => (
                <div key={a.title} className="rounded-2xl bg-white/[0.03] p-4">
                  <p className="font-semibold text-cloud">{a.title}</p>
                  <p className="text-xs text-cloud-dim">{a.world} {"\u00B7"} Due {a.due}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-cloud-muted">{a.submitted}/{a.total} submitted</span>
                    <span className="text-cloud-dim">{Math.round((a.submitted / a.total) * 100)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-aurora-violet to-aurora-bloom" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Mastery heat map</h2>
            <div className="grid grid-cols-4 gap-2">
              {["AI Basics", "Data", "Labels", "Classification", "Neural Nets", "Vision", "NLP", "Prompting", "Generative", "Agents", "Ethics", "Deploy"].map((skill, i) => {
                const level = Math.floor(Math.sin(i * 2.3) * 0.5 + 0.5) * 100;
                const pct = Math.max(15, Math.min(100, level));
                return (
                  <div key={skill} className="rounded-lg p-2 text-center" style={{ backgroundColor: `rgba(45, 212, 191, ${pct / 100 * 0.4})` }} title={`${skill}: ${Math.round(pct)}%`}>
                    <p className="text-[9px] font-medium text-cloud">{skill}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
