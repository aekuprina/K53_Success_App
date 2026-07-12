import type { Config } from "tailwindcss";

// Ultramarine design system — tokens live as CSS variables in globals.css
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        card: "var(--card)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        hero: "var(--hero)",
        heroink: "var(--heroInk)",
        heromut: "var(--heroMut)",
        accent: "var(--accent)",
        accentink: "var(--accentInk)",
        ok: "var(--ok)",
        bad: "var(--bad)",
        soft: "var(--soft)",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Oswald", "Archivo Narrow", "Arial Narrow", "system-ui", "sans-serif"],
      },
      borderRadius: {
        tile: "16px",
        card: "22px",
        hero: "30px",
      },
      keyframes: {
        screenIn: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        sheetUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        screenIn: "screenIn .26s ease both",
        sheetUp: "sheetUp .3s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
