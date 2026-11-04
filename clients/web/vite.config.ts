import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
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
 * src/i18n/early.ts, an entry of its own, runs before the app's: its few kilobytes start fetching the
 * voter's language while the app's own script still downloads. An external script, which the content security
 * policy allows as 'self' (an inline one would need its hash in deploy/Caddyfile).
 */
function earlyLanguage(): Plugin {
  return {
    name: 'early-language',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        const early = Object.values(bundle ?? {}).find((output) => output.type === 'chunk' && output.isEntry && output.name === 'early');
        return early ? [{ tag: 'script', attrs: { type: 'module', crossorigin: true, src: `/${early.fileName}` }, injectTo: 'head-prepend' }] : [];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), earlyLanguage()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('index.html', import.meta.url)),
        early: fileURLToPath(new URL('src/i18n/early.ts', import.meta.url)),
      },
    },
  },
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
