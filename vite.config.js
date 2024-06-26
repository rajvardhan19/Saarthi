import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Saarthi",
        short_name: "Saarthi",
        description: "Your Guide to Inner Peace",
        theme_color: "#ffffff",
        icons: [
          {
            src: "saarthi192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "saarthi512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist", // ensure this matches your output directory
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
