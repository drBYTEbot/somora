export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  date?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  emoji: string;
  tier: number;
  unlocked: boolean;
  dependsOn?: string[];
}

export const learnerProgress = {
  level: 7,
  levelTitle: "AI Explorer",
  nextTitle: "AI Creator",
  xp: 2840,
  xpToNext: 3600,
  coins: 1240,
  gems: 38,
  streak: 12,
  streakBest: 21,
  worldsUnlocked: 3,
  worldsTotal: 10,
  lessonsCompleted: 18,
  lessonsTotal: 47,
  projectsBuilt: 4,
  gamesPlayed: 9,
  gamesTotal: 10,
  rank: "Top 8%",
  timeThisWeek: "3h 40m",
};

export const achievements: Achievement[] = [
  { id: "first-steps", name: "First Steps", emoji: "\u{1F45F}", description: "Completed your first lesson", unlocked: true, date: "2 days ago" },
  { id: "curious-mind", name: "Curious Mind", emoji: "\u{1F9E0}", description: "Asked the AI tutor 10 questions", unlocked: true, date: "yesterday" },
  { id: "data-wizard", name: "Data Wizard", emoji: "\u{1F4CA}", description: "Trained your first classifier", unlocked: true, date: "3 days ago" },
  { id: "streak-7", name: "Week Warrior", emoji: "\u{1F525}", description: "7-day learning streak", unlocked: true, date: "today" },
  { id: "builder", name: "Builder", emoji: "\u{1F6E0}\u{FE0F}", description: "Published your first project", unlocked: true, date: "5 days ago" },
  { id: "prompt-pro", name: "Prompt Pro", emoji: "\u2728", description: "Beat Prompt Wizard", unlocked: true, date: "today" },
  { id: "world-explorer", name: "World Explorer", emoji: "\u{1F30D}", description: "Unlock 3 worlds", unlocked: true, date: "4 days ago" },
  { id: "neural-novice", name: "Neural Novice", emoji: "\u{1F9A0}", description: "Build a neural network", unlocked: false },
  { id: "boss-slayer", name: "Boss Slayer", emoji: "\u{1F480}", description: "Win your first boss battle", unlocked: false },
  { id: "streak-30", name: "Unstoppable", emoji: "\u{1F451}", description: "30-day learning streak", unlocked: false },
  { id: "ai-creator", name: "AI Creator", emoji: "\u{1F3C6}", description: "Deploy a real AI app", unlocked: false },
  { id: "mentor", name: "Mentor", emoji: "\u{1F4AC}", description: "Help 5 peers in class", unlocked: false },
];

export const skillTree: SkillNode[] = [
  { id: "ai-basics", name: "AI Basics", emoji: "\u{1F9E0}", tier: 0, unlocked: true },
  { id: "data", name: "Data & Datasets", emoji: "\u{1F4CA}", tier: 1, unlocked: true, dependsOn: ["ai-basics"] },
  { id: "labels", name: "Labels & Training", emoji: "\u{1F3F7}\u{FE0F}", tier: 1, unlocked: true, dependsOn: ["ai-basics"] },
  { id: "classification", name: "Classification", emoji: "\u{1F50E}", tier: 2, unlocked: true, dependsOn: ["data", "labels"] },
  { id: "neural-nets", name: "Neural Networks", emoji: "\u{1F9A0}", tier: 2, unlocked: false, dependsOn: ["data", "labels"] },
  { id: "vision", name: "Computer Vision", emoji: "\u{1F441}\u{FE0F}", tier: 3, unlocked: false, dependsOn: ["classification"] },
  { id: "nlp", name: "Language & NLP", emoji: "\u{1F4AC}", tier: 3, unlocked: false, dependsOn: ["classification"] },
  { id: "prompting", name: "Prompt Engineering", emoji: "\u2728", tier: 3, unlocked: false, dependsOn: ["labels"] },
  { id: "generative", name: "Generative AI", emoji: "\u{1F3A8}", tier: 4, unlocked: false, dependsOn: ["vision", "nlp"] },
  { id: "agents", name: "AI Agents", emoji: "\u{1F916}", tier: 4, unlocked: false, dependsOn: ["prompting", "nlp"] },
  { id: "deploy", name: "Build & Deploy", emoji: "\u{1F680}", tier: 5, unlocked: false, dependsOn: ["generative", "agents"] },
];

export const weeklyXP = [
  { day: "Mon", xp: 320 },
  { day: "Tue", xp: 480 },
  { day: "Wed", xp: 210 },
  { day: "Thu", xp: 560 },
  { day: "Fri", xp: 390 },
  { day: "Sat", xp: 640 },
  { day: "Sun", xp: 240 },
];
