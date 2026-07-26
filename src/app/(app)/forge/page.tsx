"use client";

import { motion } from "framer-motion";
import { projects, projectTemplates } from "@/config/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";

export default function ForgePage() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Somora Forge"
          title="Your portfolio"
          description="Publish your creations, earn achievements, and share them with family, class, and the Somora community."
        />
        <Button href="/studio" className="shrink-0">
          <Icon name="sparkles" className="h-4 w-4" />
          Build something new
        </Button>
      </div>

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
        <h2 className="mb-4 font-display text-xl font-bold text-cloud">Featured creations</h2>
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

      {rest.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">More from the community</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-4xl glass p-6 transition-all hover:-translate-y-1"
              >
                <div className={cn("absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", p.gradient)} />
                <div className="relative mb-4 flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-glow", p.gradient)}>
                    <span aria-hidden="true">{p.emoji}</span>
                  </div>
                </div>
                <h3 className="relative font-display font-bold text-cloud">{p.title}</h3>
                <p className="relative text-xs text-cloud-dim">by {p.author}</p>
                <p className="relative mt-2 text-sm text-cloud-muted">{p.description}</p>
                <div className="relative mt-3 flex items-center gap-4 text-xs text-cloud-dim">
                  <span>{"\u{1F44D}"} {p.likes}</span>
                  <span>{"\u{1F441}\u{FE0F}"} {p.views}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
