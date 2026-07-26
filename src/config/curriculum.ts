export interface Lesson {
  id: string;
  title: string;
  type: "story" | "interactive" | "mini-game" | "quiz" | "challenge";
  duration: string;
  done?: boolean;
}

export interface CurriculumTrack {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  text: string;
  lessons: Lesson[];
  progress: number;
}

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    emoji: "\u{1F9E0}",
    description: "What is AI, how it thinks, and where it lives in your world.",
    gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-300",
    progress: 65,
    lessons: [
      { id: "l1", title: "What is Artificial Intelligence?", type: "story", duration: "6 min", done: true },
      { id: "l2", title: "How machines learn vs how you learn", type: "interactive", duration: "8 min", done: true },
      { id: "l3", title: "Spotting AI in everyday life", type: "quiz", duration: "5 min", done: true },
      { id: "l4", title: "Narrow AI vs General AI", type: "story", duration: "7 min" },
      { id: "l5", title: "The AI mindset: identify a problem", type: "challenge", duration: "10 min" },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    emoji: "\u{1F4CA}",
    description: "Data, labels, training, and the patterns that power it all.",
    gradient: "from-teal-500 to-emerald-600",
    text: "text-teal-300",
    progress: 40,
    lessons: [
      { id: "l1", title: "What is training data?", type: "story", duration: "6 min", done: true },
      { id: "l2", title: "Labels teach answers", type: "interactive", duration: "9 min", done: true },
      { id: "l3", title: "Train your first classifier", type: "mini-game", duration: "12 min" },
      { id: "l4", title: "Accuracy, mistakes & retraining", type: "interactive", duration: "8 min" },
      { id: "l5", title: "Bias in training data", type: "challenge", duration: "11 min" },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    emoji: "\u{1F9A0}",
    description: "Neurons, layers, and how learning flows like a glowing city.",
    gradient: "from-fuchsia-500 to-purple-600",
    text: "text-fuchsia-300",
    progress: 20,
    lessons: [
      { id: "l1", title: "Meet a neuron", type: "story", duration: "6 min", done: true },
      { id: "l2", title: "Layers and connections", type: "interactive", duration: "10 min" },
      { id: "l3", title: "Build a network", type: "mini-game", duration: "14 min" },
      { id: "l4", title: "Why deep is deep", type: "story", duration: "7 min" },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    emoji: "\u{1F441}\u{FE0F}",
    description: "Teach AI to see — pixels, features, and bounding boxes.",
    gradient: "from-orange-500 to-red-600",
    text: "text-orange-300",
    progress: 0,
    lessons: [
      { id: "l1", title: "How computers see images", type: "story", duration: "6 min" },
      { id: "l2", title: "Cat vs Dog classifier", type: "mini-game", duration: "12 min" },
      { id: "l3", title: "Object detection with boxes", type: "interactive", duration: "10 min" },
      { id: "l4", title: "Face & emotion recognition", type: "challenge", duration: "13 min" },
    ],
  },
  {
    id: "nlp",
    title: "Language & NLP",
    emoji: "\u{1F4AC}",
    description: "How machines read, write, and understand words.",
    gradient: "from-sky-500 to-cyan-600",
    text: "text-sky-300",
    progress: 0,
    lessons: [
      { id: "l1", title: "Words become tokens", type: "story", duration: "6 min" },
      { id: "l2", title: "Spam Detective", type: "mini-game", duration: "11 min" },
      { id: "l3", title: "Sentiment: happy or sad?", type: "interactive", duration: "9 min" },
      { id: "l4", title: "Talking to language models", type: "challenge", duration: "12 min" },
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    emoji: "\u2728",
    description: "The art of talking to AI so it gives you magic.",
    gradient: "from-purple-500 to-fuchsia-600",
    text: "text-purple-300",
    progress: 0,
    lessons: [
      { id: "l1", title: "Why prompts matter", type: "story", duration: "5 min" },
      { id: "l2", title: "Prompt Wizard challenge", type: "mini-game", duration: "10 min" },
      { id: "l3", title: "Role & few-shot prompting", type: "interactive", duration: "9 min" },
      { id: "l4", title: "Structured outputs", type: "challenge", duration: "11 min" },
    ],
  },
  {
    id: "ethics",
    title: "AI Ethics & Safety",
    emoji: "\u2696\u{FE0F}",
    description: "Building AI that is fair, safe, and responsible.",
    gradient: "from-amber-500 to-yellow-600",
    text: "text-amber-300",
    progress: 0,
    lessons: [
      { id: "l1", title: "What is fair AI?", type: "story", duration: "7 min" },
      { id: "l2", title: "Bias Detective", type: "mini-game", duration: "12 min" },
      { id: "l3", title: "Hallucinations & mistakes", type: "interactive", duration: "8 min" },
      { id: "l4", title: "Designing responsibly", type: "challenge", duration: "13 min" },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    emoji: "\u{1F3A8}",
    description: "AI that creates — images, stories, music, and code.",
    gradient: "from-rose-500 to-pink-600",
    text: "text-rose-300",
    progress: 0,
    lessons: [
      { id: "l1", title: "How AI imagines images", type: "story", duration: "7 min" },
      { id: "l2", title: "AI Artist studio", type: "mini-game", duration: "14 min" },
      { id: "l3", title: "Story AI workshop", type: "interactive", duration: "10 min" },
      { id: "l4", title: "Responsible creation", type: "challenge", duration: "11 min" },
    ],
  },
];
