import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  base: mode === "production" ? "/Make4Gamers-PIISW/" : "/",
  server: {
    host: true,
    fs: {
      allow: ['..']
    }
  }
}));