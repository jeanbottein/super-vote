interface ImportMetaEnv {
  /**
   * Where the API lives, when it is not on the page's own origin: the
   * Android app's build (.env.android). Unset, the API is same-origin. Links
   * people share are built from it too (`siteOrigin`).
   */
  readonly VITE_API_BASE_URL?: string;
}

/** "v202610212030", the time of the build (vite.config.ts). */
declare const __SUPER_VOTE_VERSION__: string;

/** package.json's version, "1.4.0": the Android app's versionName, said to the server by the app (vite.config.ts). */
declare const __SUPER_VOTE_APP_VERSION__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
