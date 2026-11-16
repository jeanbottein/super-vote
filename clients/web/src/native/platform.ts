/**
 * The packaged app this build is for, or null on the website. `vite build
 * --mode android` makes the Android app's build (npm run build:android), so
 * the bundle knows without asking Capacitor, whose code the website never
 * downloads.
 */
export function appPlatform(): 'android' | null {
  return import.meta.env.MODE === 'android' ? 'android' : null;
}
