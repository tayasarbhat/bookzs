import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bookz/quiz-app/', // Base URL for quiz app on GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});