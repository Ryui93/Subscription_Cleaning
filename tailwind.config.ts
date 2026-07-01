import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        shell: "#06070b",
        panel: "#111722",
        line: "#334052",
        signal: "#54f6d4",
        magenta: "#ff4fa3",
        amber: "#ffbf47"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(84, 246, 212, 0.2), 0 18px 60px rgba(0, 0, 0, 0.5)",
        alert: "0 0 0 1px rgba(255, 79, 163, 0.22), 0 18px 50px rgba(255, 79, 163, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
