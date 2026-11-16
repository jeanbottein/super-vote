import { appPlatform } from './platform';

export interface SharedLink {
  title: string;
  text?: string;
  url: string;
}

/** Whether links can go to another app through the system's share sheet: always in the app, in most phones' browsers. */
export function canShareLinks(): boolean {
  return appPlatform() !== null || 'share' in navigator;
}

/** Opens the system's share sheet. Rejects when the person closes it without choosing, which is no failure. */
export async function shareLink(link: SharedLink): Promise<void> {
  if (appPlatform() === null) {
    return navigator.share(link);
  }
  // Android's WebView has no navigator.share.
  const { Share } = await import('@capacitor/share');
  await Share.share(link);
}
