export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: "daily" | "weekly" | "seasonal" | "boss";
  progress: number;
  total: number;
  emoji: string;
}

export const dailyQuests: Quest[] = [
  { id: "q1", title: "Complete a lesson", description: "Finish any lesson in the Academy", xp: 80, type: "daily", progress: 1, total: 1, emoji: "\u{1F393}" },
  { id: "q2", title: "Play a mini-game", description: "Visit the Arcade and play any game", xp: 60, type: "daily", progress: 0, total: 1, emoji: "\u{1F3AE}" },
  { id: "q3", title: "Ask the AI tutor", description: "Have a conversation with Somora AI", xp: 40, type: "daily", progress: 0, total: 1, emoji: "\u{1F916}" },
  { id: "q4", title: "Label 10 examples", description: "Help train a model with good data", xp: 100, type: "daily", progress: 7, total: 10, emoji: "\u{1F50D}" },
];

export const weeklyChallenges: Quest[] = [
  { id: "w1", title: "Build something in Studio", description: "Create a project using Somora Studio", xp: 400, type: "weekly", progress: 0, total: 1, emoji: "\u{1F6E0}\u{FE0F}" },
  { id: "w2", title: "Master a skill node", description: "Unlock a new node on your skill tree", xp: 350, type: "weekly", progress: 0, total: 1, emoji: "\u{1F3C5}" },
  { id: "w3", title: "Explore a new world", description: "Unlock the next world in Somora Universe", xp: 500, type: "weekly", progress: 0, total: 1, emoji: "\u{1F30D}" },
];

export const seasonalEvents: Quest[] = [
  {
    id: "s1",
    title: "The Great AI Adventure",
    description: "A 2-week festival of building. Complete challenges across every world to earn the exclusive Curiosity Cape.",
    xp: 2500,
    type: "seasonal",
    progress: 4,
    total: 12,
    emoji: "\u{1F389}",
  },
];

export const bossBattles: Quest[] = [
  {
    id: "b1",
    title: "The Confusion Matrix",
    description: "Defeat the boss that confuses every prediction. Use clean data and sharp labels to win.",
    xp: 800,
    type: "boss",
    progress: 0,
    total: 1,
    emoji: "\u{1F480}",
  },
];
