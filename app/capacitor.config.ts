import type { CapacitorConfig } from '@capacitor/cli';

/**
 * The Android app: the web app's own build (npm run build:android, which
 * calls the API at super-vote.org), served by the app from https://localhost
 * (the server's super-vote.app-origins). Its id can never change once
 * published (docs/ARCHITECTURE.md, "The Android app").
 */
const config: CapacitorConfig = {
  appId: 'org.supervote.app',
  appName: 'super-vote',
  webDir: 'dist',
};

export default config;
