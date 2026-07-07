import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: { 50:"#eefbf4",100:"#d6f5e3",200:"#b0eaca",300:"#7cd9ab",400:"#46c188",500:"#22a76e",600:"#158758",700:"#116c48",800:"#10563b",900:"#0e4732" },
        ink: { 900:"#0f172a", 700:"#334155", 500:"#64748b", 300:"#cbd5e1", 100:"#f1f5f9" }
      },
      fontFamily: { sans: ["system-ui","-apple-system","Segoe UI","Roboto","Helvetica","Arial","sans-serif"] }
    }
  },
  plugins: []
};
export default config;
