import type { Metadata } from "next";
import { ModuleOverview } from "@/components/ui/module-overview";
import { getModule } from "@/config/modules";

const mod = getModule("ai");

export const metadata: Metadata = {
  title: mod.name,
  description: mod.tagline,
};

export default function Page() {
  return <ModuleOverview module={mod} />;
}
