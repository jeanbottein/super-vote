import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // French typography puts no-break spaces before colons and inside « » (src/i18n/fr.test.ts): in what the
    // messages say, never in their code.
    files: ['src/i18n/*.tsx'],
    rules: {
      'no-irregular-whitespace': ['error', { skipStrings: true, skipTemplates: true, skipJSXText: true }],
    },
  },
]);
