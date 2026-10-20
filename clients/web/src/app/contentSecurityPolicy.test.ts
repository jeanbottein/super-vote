import caddyfile from '../../../../deploy/Caddyfile?raw';
import indexHtml from '../../index.html?raw';

/**
 * The deployed site lets index.html's inline scripts run by their hashes
 * (deploy/Caddyfile): a script changed without its hash would be blocked.
 * The page is parsed as a browser parses it, so that no way of writing a
 * script escapes the test; a data block (type="text/llms.txt") never runs.
 */
describe('the content security policy', () => {
  it("allows each of index.html's inline scripts", async () => {
    const page = new DOMParser().parseFromString(indexHtml, 'text/html');
    const scripts = [...page.querySelectorAll<HTMLScriptElement>('script:not([src])')]
      .filter((script) => ['', 'module', 'text/javascript'].includes(script.type))
      .map((script) => script.text);

    expect(scripts).not.toHaveLength(0);
    for (const script of scripts) {
      const hash = `'sha256-${await sha256(script)}'`;
      expect(caddyfile, `deploy/Caddyfile's script-src must allow ${hash}`).toContain(hash);
    }
  });
});

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}
