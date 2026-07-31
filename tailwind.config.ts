import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        night: {
          950: "#070411",
          900: "#0c0820",
          800: "#130d2e",
          700: "#1b1340",
          600: "#251a55",
        },
        cloud: {
          DEFAULT: "#f4f1ff",
          muted: "#c8c2e8",
          dim: "#9b94c4",
        },
        aurora: {
          teal: "#2dd4bf",
          violet: "#a78bfa",
          amber: "#fbbf24",
          rose: "#fb7185",
          sky: "#38bdf8",
          bloom: "#f472b6",
          leaf: "#34d399",
          sun: "#fcd34d",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
        "6xl": "3.25rem",
      },
      boxShadow: {
        glow: "0 0 40px -12px var(--tw-shadow-color)",
        "glow-lg": "0 0 90px -24px var(--tw-shadow-color)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-22px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "1" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%, -3%) scale(1.06)" },
          "66%": { transform: "translate(-3%, 4%) scale(0.97)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          "100%": { transform: "rotate(360deg)" },
        },
        "star-pulse": {
          "0%, 100%": {
            filter:
              "drop-shadow(0 0 10px rgba(34, 211, 238, 0.55)) drop-shadow(0 0 28px rgba(59, 130, 246, 0.25))",
          },
          "50%": {
            filter:
              "drop-shadow(0 0 18px rgba(34, 211, 238, 0.9)) drop-shadow(0 0 44px rgba(59, 130, 246, 0.5))",
          },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        "star-pulse": "star-pulse 2.4s ease-in-out infinite 1.2s",
      },
    },
  },
  plugins: [],
};

export default config;
