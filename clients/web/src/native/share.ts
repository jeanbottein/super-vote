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

export interface SharedFile {
  name: string;
  text: string;
  /** What the share sheet is titled. */
  title: string;
}

/**
 * Hands a file to another app through the share sheet: the app's way to download, since its WebView saves
 * nothing. Written to the app's cache, the one folder its FileProvider shares (res/xml/file_paths.xml).
 */
export async function shareFile({ name, text, title }: SharedFile): Promise<void> {
  const { Directory, Encoding, Filesystem } = await import('@capacitor/filesystem');
  const { uri } = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
  const { Share } = await import('@capacitor/share');
  await Share.share({ title, files: [uri] });
}
