import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from "vite-imagetools";

// Plugins

// https://vitejs.dev/config/

export default defineConfig(({ command }) => ({
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Optional: Define a specific port
  },

  assetsInclude: ["**/*.ttf"],
  plugins: [react(), imagetools()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable source maps
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "framer-motion"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-tabs"],
        },
        // Exclude JS files from the build
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split(".").at(1);
          if (/\.(js|jsx|map)$/i.test(assetInfo.name)) {
            return "assets/[name].[hash][extname]";
          }
          if (/\.(css|scss)$/i.test(assetInfo.name)) {
            return "assets/css/[name].[hash][extname]";
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return "assets/images/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
        chunkFileNames: "assets/js/[name].[hash].js",
        entryFileNames: "assets/js/[name].[hash].js",
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    minify: "terser", // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
}));
