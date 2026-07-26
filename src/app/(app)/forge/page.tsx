"use client";

import { motion } from "framer-motion";
import { projects, projectTemplates } from "@/config/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import { encodeAppForSharing } from "@/lib/ai";

export default function ForgePage() {
  const { state } = useStore();
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Somora Forge"
          title="Your portfolio"
          description="Projects you build in Studio are saved here. Share them with family, class, and the Somora community."
        />
        <Button href="/studio" className="shrink-0">
          <Icon name="sparkles" className="h-4 w-4" />
          Build something new
        </Button>
      </div>

      {state.projects.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">
            Your creations ({state.projects.length})
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-4xl glass p-6 ring-1 ring-aurora-teal/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-aurora-teal/20 to-aurora-violet/10 blur-2xl" />
                <div className="relative mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-teal to-aurora-violet text-2xl shadow-glow">
                    <span aria-hidden="true">{p.emoji}</span>
                  </div>
                  <span className="rounded-full bg-aurora-teal/15 px-2.5 py-0.5 text-xs font-semibold text-aurora-teal">Your project</span>
                </div>
                <h3 className="relative font-display text-lg font-bold text-cloud">{p.title}</h3>
                <p className="relative text-xs text-cloud-dim">{p.type}</p>
                <p className="relative mt-2 text-sm leading-relaxed text-cloud-muted">{p.description}</p>
                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-cloud-dim">{tag}</span>)}
                </div>
                <p className="relative mt-3 text-[10px] text-cloud-dim">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </p>
                {p.html && (
                  <div className="relative mt-4 flex gap-2">
                    <a
                      href={encodeAppForSharing(p.html)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-4 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95"
                    >
                      <Icon name="play" className="h-3 w-3" />
                      View app
                    </a>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${encodeAppForSharing(p.html)}`;
                        navigator.clipboard?.writeText(url);
                      }}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
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

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-cloud">Start from a template</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projectTemplates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer rounded-4xl glass p-5 transition-all hover:-translate-y-1"
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", t.gradient)}>
                <span aria-hidden="true">{t.emoji}</span>
              </div>
              <h3 className="mt-3 font-display font-semibold text-cloud">{t.name}</h3>
              <p className="mt-1 text-sm text-cloud-muted">{t.description}</p>
              <span className="mt-3 inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-cloud-dim">{t.level}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-cloud">Featured community creations</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-4xl glass p-6 transition-all hover:-translate-y-1"
            >
              <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", p.gradient)} />
              <div className="relative mb-4 flex items-center justify-between">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow shadow-white/20", p.gradient)}>
                  <span aria-hidden="true">{p.emoji}</span>
                </div>
                <span className="rounded-full bg-aurora-amber/15 px-2.5 py-0.5 text-xs font-semibold text-aurora-amber">Featured</span>
              </div>
              <h3 className="relative font-display text-lg font-bold text-cloud">{p.title}</h3>
              <p className="relative text-xs text-cloud-dim">by {p.author}</p>
              <p className="relative mt-2 text-sm leading-relaxed text-cloud-muted">{p.description}</p>
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-cloud-dim">{tag}</span>)}
              </div>
              <div className="relative mt-4 flex items-center gap-4 text-xs text-cloud-dim">
                <span>{"\u{1F44D}"} {p.likes}</span>
                <span>{"\u{1F441}\u{FE0F}"} {p.views}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {state.projects.length === 0 && (
        <div className="mt-12 rounded-4xl bg-gradient-to-br from-aurora-teal/15 via-aurora-violet/10 to-aurora-amber/10 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-cloud">Build your first project</h2>
          <p className="mt-2 text-sm text-cloud-muted">
            Head to Somora Studio, describe an app idea, and save it to your portfolio.
            Every project you build earns 150 XP and 50 coins.
          </p>
          <Button href="/studio" className="mt-4">Open Studio</Button>
        </div>
      )}
    </div>
  );
}
