import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "max-height",
        width: "max-width",
      },
      animation: {
        "bounce-once": "bounce 0.5s ease-in-out 1",
      },
    },
  },
  plugins: [],
} satisfies Config;
