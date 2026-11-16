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

/** What the share plugin rejects with when the person closes the sheet without choosing, which is no failure. */
const CLOSED = 'Share canceled';

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
 * nothing. Written to the cache's shared/ folder, the one its FileProvider may hand out (res/xml/file_paths.xml):
 * the rest of the cache holds the WebView's own, which no other app should be able to ask for. Closing the share
 * sheet without choosing is no failure; anything else rejects.
 */
export async function shareFile({ name, text, title }: SharedFile): Promise<void> {
  const { Directory, Encoding, Filesystem } = await import('@capacitor/filesystem');
  const { uri } = await Filesystem.writeFile({
    path: `shared/${name}`, data: text, directory: Directory.Cache, encoding: Encoding.UTF8, recursive: true,
  });
  const { Share } = await import('@capacitor/share');
  await Share.share({ title, files: [uri] }).catch((error: unknown) => {
    if (!(error instanceof Error && error.message === CLOSED)) {
      throw error;
    }
  });
}
