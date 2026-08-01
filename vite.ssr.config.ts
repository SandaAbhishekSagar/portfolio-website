import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Server build used only by scripts/prerender.mjs. Emits ESM into .ssr/ so the
 * prerenderer can import the React tree in Node.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: '.ssr',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'static-app': 'src/static-app.tsx',
        record: 'src/data/record.ts',
      },
      output: { format: 'esm', entryFileNames: '[name].js' },
    },
    minify: false,
    target: 'node20',
  },
});
