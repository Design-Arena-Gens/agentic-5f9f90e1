import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5F00",
          dark: "#CC4C00",
          light: "#FF8533",
        },
        secondary: {
          DEFAULT: "#0D0D0D",
          light: "#1A1A1A",
          lighter: "#2A2A2A",
        },
        accent: {
          DEFAULT: "#FFD700",
          dark: "#CCAC00",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-fire": "linear-gradient(135deg, #FF5F00 0%, #FFD700 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
