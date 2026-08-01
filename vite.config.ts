import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { apiRoutes } from './scripts/vite-api-plugin.js'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // Run API middleware first so /api/* is never treated as a Vite module URL.
  const plugins = [apiRoutes(), react(), tailwindcss()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      rollupOptions: {
        output: {
          // Keep three / R3F / drei out of the entry chunk. The 3D objects are
          // decoration mounted on demand by SplineStage, so their cost must
          // never land on first paint.
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (
                id.includes('three') ||
                id.includes('@react-three') ||
                id.includes('postprocessing') ||
                id.includes('meshline')
              ) {
                return 'three';
              }
            }
            return undefined;
          },
        },
      },
    },
  };
})
