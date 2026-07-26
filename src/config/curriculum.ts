export interface Lesson {
  id: string;
  title: string;
  type: "story" | "interactive" | "mini-game" | "quiz" | "challenge";
  duration: string;
}

export interface CurriculumTrack {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  text: string;
  lessons: Lesson[];
}

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    emoji: "\u{1F9E0}",
    description: "What is AI, how it thinks, and where it lives in your world.",
    gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-300",
    lessons: [
      { id: "ai-foundations-1", title: "What is Artificial Intelligence?", type: "story", duration: "6 min" },
      { id: "ai-foundations-2", title: "How machines learn vs how you learn", type: "interactive", duration: "8 min" },
      { id: "ai-foundations-3", title: "Spotting AI in everyday life", type: "quiz", duration: "5 min" },
      { id: "ai-foundations-4", title: "Narrow AI vs General AI", type: "story", duration: "7 min" },
      { id: "ai-foundations-5", title: "The AI mindset: identify a problem", type: "challenge", duration: "10 min" },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    emoji: "\u{1F4CA}",
    description: "Data, labels, training, and the patterns that power it all.",
    gradient: "from-teal-500 to-emerald-600",
    text: "text-teal-300",
    lessons: [
      { id: "machine-learning-1", title: "What is training data?", type: "story", duration: "6 min" },
      { id: "machine-learning-2", title: "Labels teach answers", type: "interactive", duration: "9 min" },
      { id: "machine-learning-3", title: "Train your first classifier", type: "mini-game", duration: "12 min" },
      { id: "machine-learning-4", title: "Accuracy, mistakes & retraining", type: "interactive", duration: "8 min" },
      { id: "machine-learning-5", title: "Bias in training data", type: "challenge", duration: "11 min" },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    emoji: "\u{1F9A0}",
    description: "Neurons, layers, and how learning flows like a glowing city.",
    gradient: "from-fuchsia-500 to-purple-600",
    text: "text-fuchsia-300",
    lessons: [
      { id: "neural-networks-1", title: "Meet a neuron", type: "story", duration: "6 min" },
      { id: "neural-networks-2", title: "Layers and connections", type: "interactive", duration: "10 min" },
      { id: "neural-networks-3", title: "Build a network", type: "mini-game", duration: "14 min" },
      { id: "neural-networks-4", title: "Why deep is deep", type: "story", duration: "7 min" },
    ],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    emoji: "\u{1F441}\u{FE0F}",
    description: "Teach AI to see — pixels, features, and bounding boxes.",
    gradient: "from-orange-500 to-red-600",
    text: "text-orange-300",
    lessons: [
      { id: "computer-vision-1", title: "How computers see images", type: "story", duration: "6 min" },
      { id: "computer-vision-2", title: "Cat vs Dog classifier", type: "mini-game", duration: "12 min" },
      { id: "computer-vision-3", title: "Object detection with boxes", type: "interactive", duration: "10 min" },
      { id: "computer-vision-4", title: "Face & emotion recognition", type: "challenge", duration: "13 min" },
    ],
  },
  {
    id: "nlp",
    title: "Language & NLP",
    emoji: "\u{1F4AC}",
    description: "How machines read, write, and understand words.",
    gradient: "from-sky-500 to-cyan-600",
    text: "text-sky-300",
    lessons: [
      { id: "nlp-1", title: "Words become tokens", type: "story", duration: "6 min" },
      { id: "nlp-2", title: "Spam Detective", type: "mini-game", duration: "11 min" },
      { id: "nlp-3", title: "Sentiment: happy or sad?", type: "interactive", duration: "9 min" },
      { id: "nlp-4", title: "Talking to language models", type: "challenge", duration: "12 min" },
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    emoji: "\u2728",
    description: "The art of talking to AI so it gives you magic.",
    gradient: "from-purple-500 to-fuchsia-600",
    text: "text-purple-300",
    lessons: [
      { id: "prompt-engineering-1", title: "Why prompts matter", type: "story", duration: "5 min" },
      { id: "prompt-engineering-2", title: "Prompt Wizard challenge", type: "mini-game", duration: "10 min" },
      { id: "prompt-engineering-3", title: "Role & few-shot prompting", type: "interactive", duration: "9 min" },
      { id: "prompt-engineering-4", title: "Structured outputs", type: "challenge", duration: "11 min" },
    ],
  },
  {
    id: "ethics",
    title: "AI Ethics & Safety",
    emoji: "\u2696\u{FE0F}",
    description: "Building AI that is fair, safe, and responsible.",
    gradient: "from-amber-500 to-yellow-600",
    text: "text-amber-300",
    lessons: [
      { id: "ethics-1", title: "What is fair AI?", type: "story", duration: "7 min" },
      { id: "ethics-2", title: "Bias Detective", type: "mini-game", duration: "12 min" },
      { id: "ethics-3", title: "Hallucinations & mistakes", type: "interactive", duration: "8 min" },
      { id: "ethics-4", title: "Designing responsibly", type: "challenge", duration: "13 min" },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    emoji: "\u{1F3A8}",
    description: "AI that creates — images, stories, music, and code.",
    gradient: "from-rose-500 to-pink-600",
    text: "text-rose-300",
    lessons: [
      { id: "generative-ai-1", title: "How AI imagines images", type: "story", duration: "7 min" },
      { id: "generative-ai-2", title: "AI Artist studio", type: "mini-game", duration: "14 min" },
      { id: "generative-ai-3", title: "Story AI workshop", type: "interactive", duration: "10 min" },
      { id: "generative-ai-4", title: "Responsible creation", type: "challenge", duration: "11 min" },
    ],
  },
];

export function findLesson(lessonId: string): { lesson: Lesson; track: CurriculumTrack } | null {
  for (const track of curriculumTracks) {
    const lesson = track.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, track };
  }
  return null;
}
