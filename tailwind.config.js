
/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    
    "./src/**/*.{js, ts, jsx, tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "ds-digi": ["DS-DIGI", "sans-serif"],
        'digital-7':['digital-7']
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};