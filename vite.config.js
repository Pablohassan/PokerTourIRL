import { defineConfig } from "vite";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Optional: Define a specific port
  },
  assetsInclude: ["**/*.ttf"],
  plugins: [],
});
