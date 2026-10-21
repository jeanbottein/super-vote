interface ImportMetaEnv {
  /**
   * Where the API lives, when it is not on the page's own origin - a build
   * packaged into a mobile app, for instance. Unset, the API is same-origin.
   */
  readonly VITE_API_BASE_URL?: string;
}

/** "v202610212030", the time of the build (vite.config.ts). */
declare const __SUPER_VOTE_VERSION__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
