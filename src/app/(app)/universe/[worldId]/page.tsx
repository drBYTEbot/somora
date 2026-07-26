import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { worlds } from "@/config/worlds";
import { ModuleOverview } from "@/components/ui/module-overview";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { cn } from "@/lib/utils";

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
  const locked = !world.unlocked;

  if (locked) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-5xl glass-strong p-10 text-center">
          <div className={cn("mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl opacity-50 grayscale shadow-glow-lg", world.gradient, world.glow)}>
            <span aria-hidden="true">{world.emoji}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-cloud">{world.name}</h1>
          <p className="mt-2 text-cloud-muted">{world.blurb}</p>
          <div className="mx-auto my-6 flex max-w-xs items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-cloud-dim">
            <Icon name="lock" className="h-4 w-4 shrink-0" />
            Complete the previous worlds to unlock this one.
          </div>
          <Button href="/universe" variant="outline">Back to the map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <Link href="/universe" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cloud-dim transition-colors hover:text-cloud">
        <span aria-hidden="true">&larr;</span> Back to Universe
      </Link>

      <div className={cn("relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-12")}>
        <div className={cn("absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-25 blur-3xl", world.gradient)} />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-5xl shadow-glow-lg", world.gradient, world.glow)}>
            <span aria-hidden="true">{world.emoji}</span>
          </div>
          <div>
            <p className={cn("text-sm font-semibold uppercase tracking-wider", world.text)}>{world.topic}</p>
            <h1 className="font-display text-4xl font-bold text-cloud sm:text-5xl">{world.name}</h1>
            <p className="mt-2 text-cloud-muted">{world.blurb}</p>
          </div>
        </div>
        <div className="relative mt-8 rounded-3xl bg-night-950/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Your story so far</p>
          <p className="mt-2 leading-relaxed text-cloud">{content.story}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-2xl font-bold text-cloud">Lessons in this world</h2>
          <div className="space-y-3">
            {content.lessons.map((lesson, i) => (
              <div key={lesson.title} className="group flex items-center gap-4 rounded-2xl glass p-4 transition-all duration-200 hover:bg-white/[0.06]">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold", i === 0 ? "bg-aurora-teal/20 text-aurora-teal ring-1 ring-aurora-teal/30" : "bg-white/5 text-cloud-dim ring-1 ring-white/10")}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-cloud">{lesson.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-cloud-dim">
                    <span>{lesson.type}</span>
                    <span>&middot;</span>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
                <Icon name="chevron-right" className="h-4 w-4 text-cloud-dim transition-transform group-hover:translate-x-0.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl glass p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Today&apos;s activity</p>
            <p className="mt-2 leading-relaxed text-cloud">{content.activity}</p>
            <Button href="/academy" className="mt-4 w-full">Start lesson</Button>
          </div>
          <div className="rounded-3xl glass p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Rewards</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">+120 XP</span>
              <span className="rounded-full bg-aurora-violet/15 px-3 py-1 text-xs font-semibold text-aurora-violet">+50 Coins</span>
              <span className="rounded-full bg-aurora-teal/15 px-3 py-1 text-xs font-semibold text-aurora-teal">1 Gem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
