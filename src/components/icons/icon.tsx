import { cn } from "@/lib/utils";

export type IconName =
  | "menu"
  | "close"
  | "arrow-right"
  | "chevron-right"
  | "compass"
  | "sparkles"
  | "lock"
  | "play"
  | "star"
  | "map"
  | "globe"
  | "external"
  | "refresh"
  | "github"
  | "universe"
  | "studio"
  | "labs"
  | "arcade"
  | "creator"
  | "academy"
  | "profile"
  | "chat"
  | "send";

const paths: Record<IconName, React.ReactNode> = {
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "chevron-right": <path d="M9 6l6 6-6 6" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.7 4.5L18 9l-4.3 1.5L12 15l-1.7-4.5L6 9l4.3-1.5L12 3z" />
      <path d="M19 14l.7 1.8L21.5 16l-1.8.7L19 18l-.7-1.3L16.5 16l1.8-.2L19 14z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: <path d="M7 5l12 7-12 7V5z" />,
  star: (
    <path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18l-5.9 3 1.2-6.5L2.5 9.9 9 9z" />
  ),
  map: (
    <>
      <path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />,
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
  ),
  universe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  studio: (
    <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6 6 2.4 2.4 6-6a4 4 0 0 0 5.6-5.6l-2.8 2.8-2-2 2.8-2.8z" />
  ),
  labs: (
    <>
      <path d="M9 3h6M10 3v6l-4 8a2 2 0 0 0 2 3h8a2 2 0 0 0 2-3l-4-8V3" />
      <path d="M7 16h10" />
    </>
  ),
  arcade: (
    <>
      <path d="M6 8h12a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2l-2-2h-4l-2 2H6a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3z" />
      <path d="M8 12h2M14 12h2" />
    </>
  ),
  creator: (
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 11.8L11 13M12.2 6.2L11 5" />
  ),
  academy: (
    <>
      <path d="M3 9l9-5 9 5-9 5-9-5z" />
      <path d="M7 11v5c0 1 2 3 5 3s5-2 5-3v-5" />
      <path d="M21 9v5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  chat: (
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4v-4H5a2 2 0 0 1-2-2z" />
  ),
  send: <path d="M3 20l18-8L3 4v6l12 2-12 2v6z" />,
};

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
