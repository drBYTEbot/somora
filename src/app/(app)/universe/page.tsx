"use client";

import { motion } from "framer-motion";
import { WorldMap } from "@/components/world/world-map";

export default function UniversePage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-cloud sm:text-3xl">
        Universe
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WorldMap />
      </motion.div>
    </div>
  );
}
