"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SomoraModule } from "@/config/modules";
import { StatusBadge } from "./status-badge";
import { Button } from "./button";

export function ModuleOverview({ module }: { module: SomoraModule }) {
  return (
    <div className="container-page py-10 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-12"
      >
        <div
          className={cn(
            "absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-25 blur-3xl",
            module.gradient,
          )}
        />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-4">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-glow-lg",
                  module.gradient,
                  module.glow,
                )}
              >
                <span aria-hidden="true">{module.emoji}</span>
              </div>
              <StatusBadge status={module.status} />
            </div>
            <h1 className="font-display text-4xl font-bold text-cloud sm:text-5xl">
              {module.name}
            </h1>
            <p className={cn("mt-2 text-lg font-medium", module.text)}>
              {module.tagline}
            </p>
            <p className="mt-4 leading-relaxed text-cloud-muted">
              {module.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Button href="/universe" variant="primary">
              Explore Universe
            </Button>
            <Button href="/hub" variant="ghost">
              View progress
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-cloud">
          What you&apos;ll do here
        </h2>
        <span className="text-xs uppercase tracking-wider text-cloud-dim">
          Planned for MVP+
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {module.features.map((feature, i) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
            className="rounded-3xl glass p-5"
          >
            <div
              className={cn(
                "mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-night-950",
                module.gradient,
              )}
            >
              {i + 1}
            </div>
            <p className="text-sm leading-relaxed text-cloud">{feature}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-3xl glass p-6 sm:flex-row sm:items-center">
        <p className="text-sm text-cloud-muted">
          This module is part of the Somora learning universe.
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-cloud transition-colors hover:text-aurora-teal"
        >
          &larr; Back to portal
        </Link>
      </div>
    </div>
  );
}
