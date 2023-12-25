import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';
import postcssImport from 'postcss-import';
// Plugins

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';



// https://vitejs.dev/config/



export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,      // Optional: Define a specific port
  },
  
  assetsInclude: ['**/*.ttf'],
  
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     '@': resolve(__dirname, 'src'),
  //   },
  // },
  css: {
    postcss: {
      plugins: [
        (postcssImport() as any),
        tailwindcss,
        autoprefixer
      ],
    },
  },
 
});
