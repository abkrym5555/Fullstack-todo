/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        surface: "#12121a",
        surface2: "#1a1a27",
        border: "#ffffff0f",
        accent: "#7c6af7",
        accent2: "#f0abfc",
        text: "#f0f0ff",
        muted: "#6b6b8a",
        success: "#34d399",
        warn: "#fbbf24",
        danger: "#f87171",
        high: "#f87171",
        medium: "#fbbf24",
        low: "#34d399",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
