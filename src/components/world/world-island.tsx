"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SomoraWorld } from "@/config/worlds";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";

export function WorldIsland({
  world,
  index = 0,
}: {
  world: SomoraWorld;
  index?: number;
}) {
  const { isWorldUnlocked } = useStore();
  const locked = !isWorldUnlocked(world.id);

  const inner = (
    <div className="relative flex flex-col items-center text-center">
      <div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-glow-lg ring-1 ring-white/25 transition-transform duration-300 sm:h-20 sm:w-20 sm:text-3xl",
          "animate-float bg-gradient-to-br",
          world.gradient,
          world.glow,
          locked && "opacity-50 grayscale",
          !locked && "group-hover:scale-110",
        )}
        style={{ animationDelay: `${index * 0.4}s` }}
      >
        <Icon name={world.iconName as any} className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        {locked ? (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-night-900 text-cloud-muted ring-2 ring-night-950">
            <Icon name="lock" className="h-3 w-3" />
          </span>
        ) : (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-night-900 text-[10px] font-bold text-aurora-teal ring-2 ring-night-950">
            {world.order}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-2 max-w-[7rem] font-display text-xs font-semibold sm:text-sm",
          locked ? "text-cloud-dim" : "text-cloud",
        )}
      >
        {world.name}
      </p>
      <p className="hidden text-[10px] uppercase tracking-wider text-cloud-dim sm:block">
        {world.topic}
      </p>
    </div>
  );

  return (
    <motion.div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        locked ? "cursor-not-allowed" : "group",
      )}
      style={{ left: `${world.x}%`, top: `${world.y}%` }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {locked ? (
        <div aria-disabled="true" title="Locked — complete previous worlds to unlock">
          {inner}
        </div>
      ) : (
        <Link
          href={`/universe/${world.id}`}
          title={`${world.name} \u2014 ${world.blurb}`}
        >
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
