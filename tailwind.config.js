/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/components/**/*.{jsx,css}"],
  theme: {
    extend: {
      screens: {
        "max-xs": { max: "475px" },
        "max-sm": { max: "640px" },
        "max-md": { max: "768px" },
        "max-lg": { max: "1024px" },
        "max-xl": { max: "1280px" },
        "max-2xl": { max: "1536px" },
        "min-cus-lg": { min: "1066px" },
        "min-cus-md": { min: "769px" },
      },
      colors: {
        thought: {
          50: "#f0f9f9",
          75: "#e9f7f7",
          100: "#198b91",
          200: "#1d6365",
        },
        hub: {
          50: "#f9f9f9",
          100: "#2b3759",
        },
      },
      keyframes: {
        like: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        unlike: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
        slideProgress: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        like: "like 0.3s ease",
        unlike: "unlike 0.3s ease",
        slideProgress: "slideProgress 3s linear infinite",
      },
    },
  },
  plugins: [],
};
