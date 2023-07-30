/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
      './src/**/*.tsx',
      './src/**/*.jsx',
      './src/components/**/*.tsx',
      './src/components/**/*.jsx',
      './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
}

