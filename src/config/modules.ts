export type ModuleId =
  | "universe"
  | "studio"
  | "labs"
  | "arcade"
  | "academy";

export type ModuleStatus = "live" | "soon";

export interface SomoraModule {
  id: ModuleId;
  name: string;
  short: string;
  icon: string;
  tagline: string;
  description: string;
  href: string;
  gradient: string;
  text: string;
  ring: string;
  glow: string;
  status: ModuleStatus;
  features: string[];
}

export const modules: SomoraModule[] = [
  {
    id: "universe",
    name: "Somora Universe",
    short: "Universe",
    icon: "universe",
    tagline: "The interactive world map and learning journey",
    description:
      "Travel between worlds. Each world unlocks progressively as curiosity grows into capability.",
    href: "/universe",
    gradient: "from-violet-500 via-indigo-500 to-blue-500",
    text: "text-violet-300",
    ring: "ring-violet-400/40",
    glow: "shadow-violet-500/40",
    status: "live",
    features: [
      "Curious Grove, Robot Valley, Data Forest",
      "Neural Peaks, Vision Volcano, Language Lagoon",
      "Prompt Planet, Robotics Harbor, Innovation City",
      "Space Observatory \u2014 the final frontier",
      "Progressive unlock by skill mastery",
    ],
  },
  {
    id: "studio",
    name: "Somora Studio",
    short: "Studio",
    icon: "studio",
    tagline: "AI app builder and vibe coding environment",
    description:
      "A visual AI creation environment that grows with the learner \u2014 from drag-and-drop blocks to real Python.",
    href: "/studio",
    gradient: "from-fuchsia-500 via-purple-500 to-rose-500",
    text: "text-fuchsia-300",
    ring: "ring-fuchsia-400/40",
    glow: "shadow-fuchsia-500/40",
    status: "soon",
    features: [
      "Blocks \u2192 Low-code \u2192 JavaScript \u2192 Python",
      "Vibe Coding mode: describe it, then build it",
      "Every generated component explained step-by-step",
      "AI App Builder for chatbots, classifiers & games",
      "Publish to shareable links & classroom galleries",
    ],
  },
  {
    id: "labs",
    name: "Somora Labs",
    short: "Labs",
    icon: "labs",
    tagline: "Hands-on AI and machine learning experiments",
    description:
      "Interactive experiments where children safely explore neural networks, vision, and generation.",
    href: "/labs",
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    text: "text-emerald-300",
    ring: "ring-emerald-400/40",
    glow: "shadow-emerald-500/40",
    status: "soon",
    features: [
      "Train image, text & sound classifiers",
      "Object detection with bounding boxes",
      "Voice & gesture recognition on-device",
      "Recommendation system sandbox",
      "ML playground: epochs, learning rate, bias",
    ],
  },
  {
    id: "arcade",
    name: "Somora Arcade",
    short: "Arcade",
    icon: "arcade",
    tagline: "Educational AI mini-games",
    description:
      "A library of mini-games where each one teaches a single AI concept through play.",
    href: "/arcade",
    gradient: "from-orange-500 via-amber-500 to-rose-500",
    text: "text-amber-300",
    ring: "ring-amber-400/40",
    glow: "shadow-amber-500/40",
    status: "soon",
    features: [
      "Train a Robot, Spam Detective, Bias Detective",
      "Cat vs Dog Classifier, Prompt Wizard",
      "Neural Network Builder, AI Artist",
      "Autonomous Car & Emotion Recognition",
      "Difficulty adapts to the child\u2019s skill",
    ],
  },
  {
    id: "academy",
    name: "Somora Academy",
    short: "Academy",
    icon: "academy",
    tagline: "Structured learning curriculum",
    description:
      "Guided curriculum across AI, ML, vision, NLP, robotics, and ethics \u2014 wrapped in story and play.",
    href: "/academy",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    text: "text-blue-300",
    ring: "ring-blue-400/40",
    glow: "shadow-blue-500/40",
    status: "soon",
    features: [
      "Story \u2192 Animation \u2192 Interaction \u2192 Mini-game",
      "Quiz \u2192 Creative challenge \u2192 Reflection \u2192 Reward",
      "Learning objectives by age group",
      "Tracks: ML, Vision, NLP, Prompting, Ethics",
      "Responsible AI & AI safety woven throughout",
    ],
  },
];

export const moduleMap: Record<ModuleId, SomoraModule> = modules.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<ModuleId, SomoraModule>,
);

export function getModule(id: ModuleId): SomoraModule {
  return moduleMap[id];
}
