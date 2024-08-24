
/** @type {import('tailwindcss').Config} */
// import { nextui } from "@nextui-org/react";
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{html, js, ts, jsx, tsx}",
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
  
  plugins: [nextui()],
};
