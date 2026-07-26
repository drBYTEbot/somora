export interface ArcadeGame {
  id: string;
  name: string;
  emoji: string;
  concept: string;
  description: string;
  gradient: string;
  text: string;
  glow: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  playable: boolean;
  conceptTags: string[];
}

export const arcadeGames: ArcadeGame[] = [
  {
    id: "data-detective",
    name: "Data Detective",
    emoji: "\u{1F50D}",
    concept: "Good vs bad training data",
    description:
      "Inspect examples and decide if each one is good training data or biased, broken, or misleading. Learn why datasets decide everything.",
    gradient: "from-emerald-500 to-teal-600",
    text: "text-emerald-300",
    glow: "shadow-emerald-500/40",
    difficulty: "Beginner",
    duration: "5 min",
    playable: true,
    conceptTags: ["Datasets", "Bias", "Labels"],
  },
  {
    id: "train-robot",
    name: "Train a Robot",
    emoji: "\u{1F916}",
    concept: "Supervised learning",
    description:
      "Label images to teach a robot. Watch its accuracy climb as you add more examples — and crash when you feed it bad data.",
    gradient: "from-sky-500 to-blue-600",
    text: "text-sky-300",
    glow: "shadow-sky-500/40",
    difficulty: "Beginner",
    duration: "7 min",
    playable: true,
    conceptTags: ["Classification", "Accuracy", "Training"],
  },
  {
    id: "prompt-wizard",
    name: "Prompt Wizard",
    emoji: "\u{1F9D9}",
    concept: "Prompt engineering",
    description:
      "Two prompts, two results. Pick the prompt that produced the better answer and learn the principle that made it work.",
    gradient: "from-fuchsia-500 to-purple-600",
    text: "text-fuchsia-300",
    glow: "shadow-fuchsia-500/40",
    difficulty: "Beginner",
    duration: "6 min",
    playable: true,
    conceptTags: ["Prompting", "Context", "Clarity"],
  },
  {
    id: "neural-builder",
    name: "Neural Network Builder",
    emoji: "\u{1F9A0}",
    concept: "Neural networks",
    description:
      "Connect virtual neurons and watch information flow through layers until the network learns a pattern.",
    gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-300",
    glow: "shadow-violet-500/40",
    difficulty: "Intermediate",
    duration: "12 min",
    playable: true,
    conceptTags: ["Neurons", "Layers", "Flow"],
  },
  {
    id: "spam-detective",
    name: "Spam Detective",
    emoji: "\u{1F4E7}",
    concept: "Text classification",
    description:
      "Read messages and flag the spam. Teach an AI to tell real from fake by collecting the right examples.",
    gradient: "from-amber-500 to-orange-600",
    text: "text-amber-300",
    glow: "shadow-amber-500/40",
    difficulty: "Beginner",
    duration: "8 min",
    playable: true,
    conceptTags: ["NLP", "Classification", "Text"],
  },
  {
    id: "bias-detective",
    name: "Bias Detective",
    emoji: "\u2696\u{FE0F}",
    concept: "AI fairness",
    description:
      "A model keeps making unfair predictions. Investigate the data, find the bias, and rebalance it.",
    gradient: "from-rose-500 to-red-600",
    text: "text-rose-300",
    glow: "shadow-rose-500/40",
    difficulty: "Intermediate",
    duration: "10 min",
    playable: true,
    conceptTags: ["Ethics", "Fairness", "Data"],
  },
  {
    id: "ai-artist",
    name: "AI Artist",
    emoji: "\u{1F3A8}",
    concept: "Generative AI",
    description:
      "Combine prompts and styles to generate art. Discover how small word changes create wildly different results.",
    gradient: "from-pink-500 to-rose-600",
    text: "text-pink-300",
    glow: "shadow-pink-500/40",
    difficulty: "Beginner",
    duration: "9 min",
    playable: true,
    conceptTags: ["Generative", "Creativity", "Prompts"],
  },
  {
    id: "recommendation",
    name: "Recommendation Challenge",
    emoji: "\u{1F3AF}",
    concept: "Recommendation systems",
    description:
      "Train an AI to recommend the perfect movie by teaching it what you like and why.",
    gradient: "from-cyan-500 to-teal-600",
    text: "text-cyan-300",
    glow: "shadow-cyan-500/40",
    difficulty: "Intermediate",
    duration: "11 min",
    playable: true,
    conceptTags: ["Recommendations", "Similarity", "Ranking"],
  },
  {
    id: "autonomous-car",
    name: "Autonomous Car Simulator",
    emoji: "\u{1F697}",
    concept: "Reinforcement learning",
    description:
      "Reward a self-driving car for good behavior and watch it learn to navigate a track.",
    gradient: "from-slate-400 to-slate-600",
    text: "text-slate-200",
    glow: "shadow-slate-400/40",
    difficulty: "Advanced",
    duration: "15 min",
    playable: true,
    conceptTags: ["Reinforcement", "Rewards", "Agents"],
  },
  {
    id: "emotion-recognizer",
    name: "Emotion Recognition",
    emoji: "\u{1F622}",
    concept: "Affective computing",
    description:
      "Teach an AI to recognize emotions from faces using privacy-preserving on-device models.",
    gradient: "from-indigo-500 to-blue-600",
    text: "text-indigo-300",
    glow: "shadow-indigo-500/40",
    difficulty: "Intermediate",
    duration: "10 min",
    playable: true,
    conceptTags: ["Vision", "Emotion", "Privacy"],
  },
];

export function getArcadeGame(id: string): ArcadeGame | undefined {
  return arcadeGames.find((g) => g.id === id);
}
