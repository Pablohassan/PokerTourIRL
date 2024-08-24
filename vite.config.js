import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from 'tailwindcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import { nextui } from "@nextui-org/react";

export default defineConfig({
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}" // adjust this line to ensure Tailwind checks all your project files
        
      ],
    server: {
        host: '0.0.0.0', // Listen on all network interfaces
        port: 5173, // Optional: Define a specific port
    },
    assetsInclude: ['**/*.ttf'],
    plugins: [nextui()],
   
});
