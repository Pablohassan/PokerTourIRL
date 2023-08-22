
/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    
    "./src/**/*.{html, js, ts, jsx, tsx}",
   
    "./node_modules/@nextui-org/theme/dist/**/*.{html,js,ts,jsx,tsx}",
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