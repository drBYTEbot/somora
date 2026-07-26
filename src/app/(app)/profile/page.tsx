"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/icon";
import { HubTab } from "@/components/profile/hub-tab";
import { ForgeTab } from "@/components/profile/forge-tab";
import { QuestTab } from "@/components/profile/quest-tab";

type Tab = "hub" | "forge" | "quest";

const TABS: { id: Tab; label: string; icon: "profile" | "studio" | "compass" }[] = [
  { id: "hub", label: "Stats", icon: "profile" },
  { id: "forge", label: "Projects", icon: "studio" },
  { id: "quest", label: "Quests", icon: "compass" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("hub");

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-teal to-aurora-violet">
          <Icon name="profile" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-cloud">Profile</h1>
          <p className="text-sm text-cloud-dim">Your stats, projects, and quests</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
              tab === t.id
                ? "bg-white/10 text-cloud ring-1 ring-white/10"
                : "text-cloud-dim hover:bg-white/5 hover:text-cloud-muted",
            )}
          >
            <Icon name={t.icon} className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "hub" && <HubTab />}
          {tab === "forge" && <ForgeTab />}
          {tab === "quest" && <QuestTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
