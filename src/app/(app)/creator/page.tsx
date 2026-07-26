"use client";

import { motion } from "framer-motion";
import { llmConcepts } from "@/config/prompts";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { PromptWizard } from "@/components/arcade/prompt-wizard";

export default function CreatorPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Creator"
        title="Prompt engineering & generative AI"
        description="Learn to communicate with AI. Master the art of the prompt, then explore how language models actually work under the hood."
        center
      />

      <div className="mt-10">
        <h2 className="mb-2 font-display text-2xl font-bold text-cloud">LLM Explorer</h2>
        <p className="mb-6 text-cloud-muted">Large Language Models, explained as visual worlds.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {llmConcepts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-4xl glass p-6 transition-all hover:-translate-y-1"
            >
              <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", c.gradient)} />
              <div className="relative">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", c.gradient)}>
                  <span aria-hidden="true">{c.emoji}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-cloud">{c.term}</h3>
                <p className={cn("text-xs font-medium bg-gradient-to-r bg-clip-text text-transparent", c.gradient)}>{c.analogy}</p>
                <p className="mt-2 text-sm leading-relaxed text-cloud-muted">{c.explanation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-2 font-display text-2xl font-bold text-cloud">Prompt lab</h2>
        <p className="mb-6 text-cloud-muted">Practice makes perfect. Can you spot the better prompt?</p>
        <PromptWizard />
      </div>

      <div className="mt-14">
        <SectionHeader eyebrow="Toolbox" title="Generative AI tools" description="Create with AI across every medium." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "AI Art Studio", emoji: "\u{1F3A8}", desc: "Generate images from prompts", gradient: "from-pink-500 to-rose-600" },
            { name: "Story Workshop", emoji: "\u{1F4D6}", desc: "Build interactive stories with AI", gradient: "from-fuchsia-500 to-purple-600" },
            { name: "Music Lab", emoji: "\u{1F3B5}", desc: "Experiment with AI-generated music", gradient: "from-violet-500 to-indigo-600" },
            { name: "Game Creator", emoji: "\u{1F3AE}", desc: "Build simple games with AI help", gradient: "from-amber-500 to-orange-600" },
          ].map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl glass p-5"
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-xl shadow-glow", tool.gradient)}>
                <span aria-hidden="true">{tool.emoji}</span>
              </div>
              <h3 className="mt-3 font-display font-semibold text-cloud">{tool.name}</h3>
              <p className="mt-1 text-xs text-cloud-muted">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
