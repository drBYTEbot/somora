export const site = {
  name: "Somora",
  tagline: "Where Curiosity Creates Intelligence.",
  description:
    "Somora is an animated AI education universe where children learn Artificial Intelligence by exploring, playing, experimenting, and building real AI projects.",
  url: "https://somora.app",
  locale: "en",
  social: {
    github: "https://github.com/drBYTEbot/somora",
  },
} as const;

export const nav = {
  primary: [
    { label: "Universe", href: "/universe" },
    { label: "Studio", href: "/studio" },
    { label: "Academy", href: "/academy" },
    { label: "Arcade", href: "/arcade" },
  ],
} as const;
