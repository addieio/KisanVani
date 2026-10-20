/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kisan: {
          green: "#0B7A3B",
          lightGreen: "#E8F5EC",
          darkGreen: "#064E26",
          amber: "#FF8A00",
          red: "#D93025",
          dark: "#132A1C",
          surface: "#F8FAF9",
        },
        stone: {
          50: "#FAFAF9",
          100: "#F5F5F7",
          200: "#E5E5EA",
          300: "#D1D1D6",
          400: "#AEAEB2",
          500: "#8E8E93",
          600: "#636366",
          700: "#3A3A3C",
          800: "#1C1C1E",
          900: "#1D1D1F",
        },
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#006C49",
        },
      },
      borderRadius: {
        "28": "28px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        ios: "0 4px 24px -2px rgba(29, 29, 31, 0.06)",
        "ios-lg": "0 12px 32px -4px rgba(29, 29, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
