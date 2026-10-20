// The web app's own stylesheets, made to draw the video's phone screens: scoped
// to `.app` elements, and laid out for a phone whatever the stage's width.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const FILES = [
  'style.css',
  'features/VotingSystem/MajorityJudgment/mentions.css',
  'features/VotingSystem/MajorityJudgment/mj-ballot.css',
  'features/VotingSystem/MajorityJudgment/majority-judgment.css',
  'features/VotingSystem/Approval/approval.css',
];

/** A stylesheet's top-level blocks: { prelude, body }, a statement such as @import having no body. */
function blocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    const semicolon = css.indexOf(';', i);
    if (open === -1) break;
    if (semicolon !== -1 && semicolon < open && css.slice(i, semicolon).trim().startsWith('@')) {
      out.push({ prelude: css.slice(i, semicolon).trim() });
      i = semicolon + 1;
      continue;
    }
    let depth = 1;
    let j = open + 1;
    while (depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    out.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

/** Rules for a phone, scoped: the tokens on :root and body move to each .app. */
function scoped(css, keyframes) {
  let out = '';
  for (const { prelude, body } of blocks(css)) {
    if (body === undefined) continue;
    if (prelude.startsWith('@keyframes')) {
      keyframes.push(`${prelude} {${body}}`); // global, as @scope cannot hold them
    } else if (prelude.startsWith('@media')) {
      if (prelude.includes('max-width: 639px')) out += scoped(body, keyframes); // a phone's: always
      // wider screens' and reduced motion's: never
    } else if (prelude.startsWith('@container')) {
      out += `${prelude} {${scoped(body, keyframes)}}\n`;
    } else {
      const selectors = prelude.split(',').map((s) => s.trim()).flatMap((s) => {
        if (s === ':root' || s === 'body') return [':scope'];
        if (s === 'html' || s.startsWith(':root[') || s.startsWith('body')) return []; // appearance, glow, grey mentions
        return [s];
      });
      if (selectors.length > 0) out += `${selectors.join(',\n')} {${body}}\n`;
    }
  }
  return out;
}

/** app.css, from clients/web/src. */
export async function appCss(src) {
  const sources = await Promise.all(FILES.map((file) => readFile(join(src, file), 'utf8')));
  const css = sources.join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const keyframes = [];
  const rules = scoped(css, keyframes);
  return `@scope (.app) {\n${rules}}\n${keyframes.join('\n')}\n`;
}
