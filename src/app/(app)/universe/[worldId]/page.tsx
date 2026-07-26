import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { worlds } from "@/config/worlds";
import { WorldDetailContent } from "@/components/world/world-detail-content";

interface WorldLesson {
  title: string;
  type: string;
  duration: string;
}

const worldContent: Record<string, { story: string; lessons: WorldLesson[]; activity: string }> = {
  "curious-grove": {
    story: "You arrive in a sunlit grove where every leaf whispers a question. The trees here don't give answers \u2014 they give better questions. A small glowing creature called a Sprout floats toward you, curious about everything you know.",
    lessons: [
      { title: "What is Artificial Intelligence?", type: "Story", duration: "6 min" },
      { title: "How machines learn vs how you learn", type: "Interactive", duration: "8 min" },
      { title: "Spotting AI in everyday life", type: "Quiz", duration: "5 min" },
      { title: "The Curious Sprout challenge", type: "Mini-game", duration: "10 min" },
    ],
    activity: "Talk to the Sprout and teach it three things AI can do. Every answer grows the grove a little taller.",
  },
  "robot-valley": {
    story: "A vast valley stretches below you, filled with robots of every shape. Some roll, some walk, some float. None of them know what to do yet \u2014 they're waiting for a mind. A friendly bot named Gear rolls up and beeps a greeting.",
    lessons: [
      { title: "What is a robot?", type: "Story", duration: "6 min" },
      { title: "Sensors: how robots sense the world", type: "Interactive", duration: "9 min" },
      { title: "Train the Robot", type: "Mini-game", duration: "12 min" },
      { title: "Robots that help people", type: "Challenge", duration: "10 min" },
    ],
    activity: "Teach Gear to recognize three objects. Each label makes it a little smarter and a little braver.",
  },
  "data-forest": {
    story: "The forest here is alive with numbers. Trees bear fruit in the shape of data points \u2014 red ones, blue ones, some that sparkle, some that are rotten. An owl made of pixels blinks at you from a branch.",
    lessons: [
      { title: "What is training data?", type: "Story", duration: "6 min" },
      { title: "Good data vs bad data", type: "Interactive", duration: "8 min" },
      { title: "Data Detective", type: "Mini-game", duration: "10 min" },
      { title: "Grow a dataset", type: "Challenge", duration: "11 min" },
    ],
    activity: "Collect 10 good data fruits and avoid the rotten ones. The owl watches and keeps score.",
  },
  "neural-peaks": {
    story: "Tower mountains rise into a sky crackling with light. Between the peaks, glowing bridges connect nodes that pulse with energy. A mountain guide made of flowing light appears beside you.",
    lessons: [
      { title: "Meet a neuron", type: "Story", duration: "6 min" },
      { title: "Layers and connections", type: "Interactive", duration: "10 min" },
      { title: "Neural Network Builder", type: "Mini-game", duration: "14 min" },
      { title: "Why deep is deep", type: "Story", duration: "7 min" },
    ],
    activity: "Connect the neurons across the peaks and watch the light flow from input to output.",
  },
  "vision-volcano": {
    story: "Heat rises from a volcano whose lava glows in patterns. The air shimmers with pixels. A creature with a single, enormous eye floats on the thermals, watching everything.",
    lessons: [
      { title: "How computers see images", type: "Story", duration: "6 min" },
      { title: "Cat vs Dog classifier", type: "Mini-game", duration: "12 min" },
      { title: "Object detection with boxes", type: "Interactive", duration: "10 min" },
      { title: "Face & emotion recognition", type: "Challenge", duration: "13 min" },
    ],
    activity: "Teach the eye to tell cats from dogs. Every correct label cools the volcano a little.",
  },
  "language-lagoon": {
    story: "A calm lagoon where words float on the surface like lily pads. Some drift together; some repel. A fish made of letters swims up and speaks in riddles.",
    lessons: [
      { title: "Words become tokens", type: "Story", duration: "6 min" },
      { title: "Spam Detective", type: "Mini-game", duration: "11 min" },
      { title: "Sentiment: happy or sad?", type: "Interactive", duration: "9 min" },
      { title: "Talking to language models", type: "Challenge", duration: "12 min" },
    ],
    activity: "Sort the messages floating on the lagoon. The fish will tell you if you got it right.",
  },
  "prompt-planet": {
    story: "A small planet orbits a sun made of pure language. The ground shifts with every word you speak. A wizard in a robe of glowing text floats down to greet you.",
    lessons: [
      { title: "Why prompts matter", type: "Story", duration: "5 min" },
      { title: "Prompt Wizard challenge", type: "Mini-game", duration: "10 min" },
      { title: "Role & few-shot prompting", type: "Interactive", duration: "9 min" },
      { title: "Structured outputs", type: "Challenge", duration: "11 min" },
    ],
    activity: "The wizard gives you two prompts. Choose the one that produces the better spell.",
  },
  "robotics-harbor": {
    story: "A bustling harbor where ships are built from code. Cranes lift functions into place. A harbor master with a clipboard made of logic gates waves you over.",
    lessons: [
      { title: "From blocks to code", type: "Story", duration: "7 min" },
      { title: "Vibe coding: describe it, build it", type: "Interactive", duration: "12 min" },
      { title: "Ship your first project", type: "Challenge", duration: "14 min" },
      { title: "Debug Detective", type: "Mini-game", duration: "11 min" },
    ],
    activity: "Describe an app idea and watch the harbor build it. Then improve it with your own touches.",
  },
  "innovation-city": {
    story: "A neon city stretches to the horizon. Startups hum on every corner. A young inventor with a jetpack lands beside you, grinning.",
    lessons: [
      { title: "Identify a real problem", type: "Story", duration: "8 min" },
      { title: "Design an AI solution", type: "Interactive", duration: "12 min" },
      { title: "Build a prototype", type: "Challenge", duration: "16 min" },
      { title: "Pitch your idea", type: "Challenge", duration: "10 min" },
    ],
    activity: "Find a problem in the city and design an AI solution. The inventor will help you pitch it.",
  },
  "space-observatory": {
    story: "At the edge of everything, an observatory peers into the future. Constellations form the shapes of technologies not yet invented. A quiet astronomer hands you a telescope.",
    lessons: [
      { title: "The frontier of AI", type: "Story", duration: "8 min" },
      { title: "AI safety & alignment", type: "Interactive", duration: "12 min" },
      { title: "Designing the future", type: "Challenge", duration: "15 min" },
      { title: "Your creator journey", type: "Reflection", duration: "10 min" },
    ],
    activity: "Look through the telescope and describe the AI you want to build someday.",
  },
};

export function generateStaticParams() {
  return worlds.map((w) => ({ worldId: w.id }));
}

export function generateMetadata({
  params,
}: {
  params: { worldId: string };
}): Metadata {
  const world = worlds.find((w) => w.id === params.worldId);
  return {
    title: world ? `${world.name} \u00B7 Somora Universe` : "World",
    description: world?.blurb,
  };
}

export default function WorldDetailPage({
  params,
}: {
  params: { worldId: string };
}) {
  const world = worlds.find((w) => w.id === params.worldId);
  if (!world) notFound();

  const content = worldContent[world.id];
  if (!content) notFound();

  return (
    <WorldDetailContent
      world={world}
      story={content.story}
      lessons={content.lessons}
      activity={content.activity}
    />
  );
}
