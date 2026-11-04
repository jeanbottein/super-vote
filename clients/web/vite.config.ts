import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// The client always calls the API on its own origin. In development Vite
// forwards /api to the Java server, so the voter cookie and the live-results
// streams work without any CORS setup. Server-sent events are plain HTTP, so
// the proxy needs no WebSocket support. What the server writes for agents
// (/llms.txt, the OpenAPI document) is forwarded too, as the deployed site's
// reverse proxy does (deploy/Caddyfile).
const server = 'http://127.0.0.1:8080';
const api = { '/api': server, '/llms.txt': server, '/v3/api-docs': server };

/** The version the footer shows: "v" and the time of the build, to the minute, in UTC (v202610212030). */
const version = 'v' + new Date().toISOString().slice(0, 16).replace(/\D/g, '');

/**
 * Lists each language's chunk in the built page (src/i18n/<language>.tsx -> its hashed file), for
 * index.html's script to start fetching the voter's beside the app's. A data block, not a script: the content
 * security policy allows index.html's script by its hash, which must not change with every build.
 */
function languageChunks(): Plugin {
  return {
    name: 'language-chunks',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        const chunks = Object.fromEntries(Object.values(bundle ?? {}).flatMap((output) => {
          const language = output.type === 'chunk' && output.facadeModuleId?.match(/\/src\/i18n\/(\w+)\.tsx$/)?.[1];
          return language ? [[language, `/${output.fileName}`]] : [];
        }));
        return [{
          tag: 'script',
          attrs: { type: 'application/json', id: 'language-chunks' },
          children: JSON.stringify(chunks),
          injectTo: 'head-prepend',
        }];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), languageChunks()],
  define: { __SUPER_VOTE_VERSION__: JSON.stringify(version) },
  server: {
    port: 5173,
    host: true, // reachable from a phone on the same network
    proxy: api,
    // The tests read deploy/Caddyfile, whose content security policy must allow index.html's script.
    fs: { allow: ['.', '../../deploy'] },
  },
  preview: {
    port: 5173,
    host: true,
    proxy: api,
  },
  test: {
    environment: 'jsdom',
    // Testing Library unmounts between tests only when it finds a global
    // afterEach; without this, one test's DOM is still there in the next.
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    coverage: {
      include: ['src/**'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
});
