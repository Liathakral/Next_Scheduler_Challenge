/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: "#0165FC",
          red: "#DB4437",
          yellow: "#F4B400",
          green: "#0F9D58",
          gray: "#5f6368",
          lightGray: "#f8f9fa",
        },
      },
    },
  },
  plugins: [],
}

