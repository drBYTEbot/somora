"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import { encodeAppForSharing } from "@/lib/ai";
import { projectTemplates, projects as featuredProjects } from "@/config/projects";

export function ForgeTab() {
  const { state } = useStore();

  return (
    <div className="space-y-6">
      {state.projects.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-cloud">
            Your creations ({state.projects.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-4xl glass p-5 ring-1 ring-aurora-teal/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-aurora-teal/20 to-aurora-violet/10 blur-2xl" />
                <div className="relative mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-teal to-aurora-violet">
                    <Icon name="studio" className="h-5 w-5 text-white" />
                  </div>
                  <span className="rounded-full bg-aurora-teal/15 px-2.5 py-0.5 text-xs font-semibold text-aurora-teal">Yours</span>
                </div>
                <h3 className="relative font-display text-base font-bold text-cloud">{p.title}</h3>
                <p className="relative text-xs text-cloud-dim">{p.type}</p>
                <p className="relative mt-1 text-sm leading-relaxed text-cloud-muted">{p.description}</p>
                <p className="relative mt-2 text-[10px] text-cloud-dim">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </p>
                {p.html && (
                  <div className="relative mt-3 flex gap-2">
                    <a
                      href={encodeAppForSharing(p.html)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-3 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95"
                    >
                      <Icon name="play" className="h-3 w-3" />
                      View
                    </a>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${encodeAppForSharing(p.html)}`;
                        navigator.clipboard?.writeText(url);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
                    >
                      <Icon name="external" className="h-3 w-3" />
                      Copy link
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-cloud">Start from a template</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projectTemplates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer rounded-4xl glass p-5 transition-all hover:-translate-y-1"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br shadow-glow", t.gradient)}>
                <Icon name="studio" className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-3 font-display font-semibold text-cloud">{t.name}</h3>
              <p className="mt-1 text-sm text-cloud-muted">{t.description}</p>
              <span className="mt-2 inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-cloud-dim">{t.level}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {state.projects.length === 0 && (
        <div className="rounded-4xl bg-gradient-to-br from-aurora-teal/15 via-aurora-violet/10 to-aurora-amber/10 p-8 text-center">
          <h3 className="font-display text-lg font-bold text-cloud">Build your first project</h3>
          <p className="mt-2 text-sm text-cloud-muted">
            Head to Studio, describe an app idea, and save it to your portfolio.
          </p>
          <Button href="/studio" className="mt-4">Open Studio</Button>
        </div>
      )}
    </div>
  );
}
