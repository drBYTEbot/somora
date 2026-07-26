export interface Project {
  id: string;
  title: string;
  author: string;
  emoji: string;
  description: string;
  tags: string[];
  likes: number;
  views: number;
  gradient: string;
  text: string;
  type: "chatbot" | "classifier" | "game" | "story" | "tool" | "art";
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Dino Tutor Bot",
    author: "Maya, age 11",
    emoji: "\u{1F996}",
    description: "A chatbot that teaches you dinosaur facts and quizzes you after each lesson.",
    tags: ["Chatbot", "NLP", "Studio"],
    likes: 142,
    views: 1240,
    gradient: "from-emerald-500 to-teal-600",
    text: "text-emerald-300",
    type: "chatbot",
    featured: true,
  },
  {
    id: "p2",
    title: "Recycle Sorter",
    author: "Dev, age 13",
    emoji: "\u{267B}\u{FE0F}",
    description: "An AI game where a robot sorts recycling into the right bin using image classification.",
    tags: ["Game", "Vision", "Classifier"],
    likes: 98,
    views: 870,
    gradient: "from-sky-500 to-blue-600",
    text: "text-sky-300",
    type: "game",
    featured: true,
  },
  {
    id: "p3",
    title: "Bedtime Story AI",
    author: "Aria, age 10",
    emoji: "\u{1F4D6}",
    description: "Describe a character and this AI generates a bedtime story around them.",
    tags: ["Story", "Generative", "NLP"],
    likes: 215,
    views: 2030,
    gradient: "from-fuchsia-500 to-purple-600",
    text: "text-fuchsia-300",
    type: "story",
    featured: true,
  },
  {
    id: "p4",
    title: "Pokémon Card Maker",
    author: "Leo, age 12",
    emoji: "\u{1F3B4}",
    description: "Generate custom Pokémon-style cards with AI-designed stats and abilities.",
    tags: ["Art", "Generative", "Fun"],
    likes: 187,
    views: 1560,
    gradient: "from-amber-500 to-orange-600",
    text: "text-amber-300",
    type: "art",
  },
  {
    id: "p5",
    title: "Homework Helper",
    author: "Priya, age 14",
    emoji: "\u{1F4DD}",
    description: "An AI agent that explains homework problems step-by-step without giving the answer.",
    tags: ["Agent", "NLP", "Tool"],
    likes: 134,
    views: 980,
    gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-300",
    type: "tool",
  },
  {
    id: "p6",
    title: "Cat vs Dog AI",
    author: "Sam, age 9",
    emoji: "\u{1F415}",
    description: "Label images and watch the AI get better at telling cats from dogs in real time.",
    tags: ["Classifier", "Vision", "Training"],
    likes: 76,
    views: 640,
    gradient: "from-rose-500 to-pink-600",
    text: "text-rose-300",
    type: "classifier",
  },
];

export interface ProjectTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  level: string;
}

export const projectTemplates: ProjectTemplate[] = [
  { id: "t1", name: "AI Chatbot", emoji: "\u{1F916}", description: "Build a conversational AI with a personality", gradient: "from-cyan-500 to-blue-600", level: "Beginner" },
  { id: "t2", name: "Image Classifier", emoji: "\u{1F50E}", description: "Train an AI to recognize objects", gradient: "from-emerald-500 to-teal-600", level: "Beginner" },
  { id: "t3", name: "Story Generator", emoji: "\u{1F4D6}", description: "Generate interactive stories with AI", gradient: "from-fuchsia-500 to-purple-600", level: "Beginner" },
  { id: "t4", name: "AI Game NPC", emoji: "\u{1F3AE}", description: "Create a game character powered by AI", gradient: "from-amber-500 to-orange-600", level: "Intermediate" },
  { id: "t5", name: "Voice Assistant", emoji: "\u{1F3A4}", description: "Build an AI that listens and responds", gradient: "from-violet-500 to-indigo-600", level: "Intermediate" },
  { id: "t6", name: "Recommendation Engine", emoji: "\u{1F3AF}", description: "Train an AI to recommend things you'll love", gradient: "from-rose-500 to-pink-600", level: "Advanced" },
];
