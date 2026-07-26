export type ModuleId =
  | "universe"
  | "studio"
  | "ai"
  | "labs"
  | "arcade"
  | "academy"
  | "quest"
  | "forge"
  | "hub"
  | "creator"
  | "class"
  | "home";

export type ModuleStatus = "live" | "soon";

export interface SomoraModule {
  id: ModuleId;
  name: string;
  short: string;
  emoji: string;
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
    emoji: "\u{1F30D}",
    tagline: "The interactive world map and learning journey",
    description:
      "Instead of courses, children travel between living worlds. Each world unlocks progressively as curiosity grows into capability.",
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
    emoji: "\u{1F6E0}\u{FE0F}",
    tagline: "AI app builder and vibe coding environment",
    description:
      "A visual AI creation environment that grows with the learner \u2014 from drag-and-drop blocks to real Python, APIs, and model deployment.",
    href: "/studio",
    gradient: "from-fuchsia-500 via-purple-500 to-rose-500",
    text: "text-fuchsia-300",
    ring: "ring-fuchsia-400/40",
    glow: "shadow-fuchsia-500/40",
    status: "soon",
    features: [
      "Blocks \u2192 Low-code \u2192 JavaScript \u2192 Python \u2192 APIs",
      "Vibe Coding mode: describe it, then build it",
      "Every generated component explained step-by-step",
      "AI App Builder for chatbots, classifiers & games",
      "Publish to shareable links & classroom galleries",
    ],
  },
  {
    id: "ai",
    name: "Somora AI",
    short: "AI Tutor",
    emoji: "\u{1F916}",
    tagline: "Personal AI tutor and learning companion",
    description:
      "A mentor that adapts to each learner \u2014 conversing, hinting, encouraging, reviewing code, and evolving alongside them.",
    href: "/ai",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    text: "text-cyan-300",
    ring: "ring-cyan-400/40",
    glow: "shadow-cyan-500/40",
    status: "soon",
    features: [
      "Adaptive tutoring with goal tracking & memory",
      "Hint generation that never just gives the answer",
      "Lesson explanations & code review",
      "Personality that evolves with the learner",
      "Encouragement tuned to growth mindset",
    ],
  },
  {
    id: "labs",
    name: "Somora Labs",
    short: "Labs",
    emoji: "\u{1F9EA}",
    tagline: "Hands-on AI and machine learning experiments",
    description:
      "Interactive experiments where children safely explore vision, speech, generation, neural networks, and reinforcement learning.",
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
    emoji: "\u{1F3AE}",
    tagline: "Educational AI mini-games",
    description:
      "A library of mini-games where each one teaches a single AI concept through repetition, feedback, and play.",
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
    emoji: "\u{1F393}",
    tagline: "Structured learning curriculum",
    description:
      "Guided curriculum across AI, ML, LLMs, vision, NLP, robotics, ethics, and entrepreneurship \u2014 wrapped in story and play.",
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
  {
    id: "quest",
    name: "Somora Quest",
    short: "Quest",
    emoji: "\u2694\u{FE0F}",
    tagline: "Daily quests, missions, and challenges",
    description:
      "Daily missions, weekly challenges, seasonal events, boss battles, and exploration quests that keep curiosity alive.",
    href: "/quest",
    gradient: "from-amber-500 via-yellow-500 to-orange-500",
    text: "text-amber-300",
    ring: "ring-amber-400/40",
    glow: "shadow-amber-500/40",
    status: "soon",
    features: [
      "Daily missions & weekly challenges",
      "Seasonal events & limited-time rewards",
      "Boss battles that test real understanding",
      "Exploration quests across worlds",
      "Special unlocks & hidden collectibles",
    ],
  },
  {
    id: "forge",
    name: "Somora Forge",
    short: "Forge",
    emoji: "\u{1F528}",
    tagline: "Project creation and portfolio builder",
    description:
      "Where creations become a portfolio. Publish projects, earn achievements, and share with parents and teachers in a moderated space.",
    href: "/forge",
    gradient: "from-rose-500 via-red-500 to-pink-500",
    text: "text-rose-300",
    ring: "ring-rose-400/40",
    glow: "shadow-rose-500/40",
    status: "soon",
    features: [
      "Publish creations to a moderated gallery",
      "Earn achievements & build a portfolio",
      "Share with family, class & community",
      "Teacher review & family sharing",
      "Every project becomes a showcase piece",
    ],
  },
  {
    id: "hub",
    name: "Somora Hub",
    short: "Hub",
    emoji: "\u{1F4CA}",
    tagline: "Dashboard and progress tracking",
    description:
      "The progress dashboard. Track XP, coins, streaks, skill mastery, projects, quests, unlocks, and goals in one place.",
    href: "/hub",
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    text: "text-teal-300",
    ring: "ring-teal-400/40",
    glow: "shadow-teal-500/40",
    status: "soon",
    features: [
      "XP, coins, gems & learning streaks",
      "Skill trees & mastery visualization",
      "Current quests & recent unlocks",
      "Projects, achievements & statistics",
      "Goals that adapt to the learner",
    ],
  },
  {
    id: "creator",
    name: "Somora Creator",
    short: "Creator",
    emoji: "\u2728",
    tagline: "Prompt engineering and generative AI tools",
    description:
      "Learn to communicate with AI. Practice role prompting, few-shot, structured outputs, and creative prompting through challenges.",
    href: "/creator",
    gradient: "from-purple-500 via-fuchsia-500 to-violet-500",
    text: "text-purple-300",
    ring: "ring-purple-400/40",
    glow: "shadow-purple-500/40",
    status: "soon",
    features: [
      "Prompt engineering lab with live feedback",
      "Role, few-shot & structured-output challenges",
      "Generative AI art, story & music tools",
      "Debug & refine prompts to improve responses",
      "LLM Explorer: tokens, context, embeddings",
    ],
  },
  {
    id: "class",
    name: "Somora Class",
    short: "Class",
    emoji: "\u{1F3EB}",
    tagline: "Teacher dashboard",
    description:
      "Assignments, analytics, classrooms, lesson plans, heat maps, and assessments for educators guiding young AI creators.",
    href: "/class",
    gradient: "from-indigo-500 via-blue-500 to-slate-500",
    text: "text-indigo-300",
    ring: "ring-indigo-400/40",
    glow: "shadow-indigo-500/40",
    status: "soon",
    features: [
      "Classrooms & roster management",
      "Assignments & lesson plans",
      "Analytics & mastery heat maps",
      "Assessments & progress reports",
      "Curriculum-aligned learning paths",
    ],
  },
  {
    id: "home",
    name: "Somora Home",
    short: "Home",
    emoji: "\u{1F3E0}",
    tagline: "Parent dashboard",
    description:
      "Learning reports, weekly summaries, suggested activities, milestones, time spent, strengths, and areas for improvement.",
    href: "/home",
    gradient: "from-sky-500 via-cyan-500 to-teal-500",
    text: "text-sky-300",
    ring: "ring-sky-400/40",
    glow: "shadow-sky-500/40",
    status: "soon",
    features: [
      "Weekly learning summaries",
      "Milestones & suggested activities",
      "Time spent & engagement insights",
      "Strengths & areas for improvement",
      "A window into your child\u2019s curiosity",
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
