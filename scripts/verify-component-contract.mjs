import { glob, readFile } from 'node:fs/promises';

const registered = new Set();
for await (const path of glob('packages/components/src/register/*.ts')) {
  const source = await readFile(path, 'utf8');
  for (const match of source.matchAll(/defineComponent\('([^']+)'/g)) registered.add(match[1]);
}

let stories = '';
for await (const path of glob('storybook/stories/**/*.stories.ts')) stories += await readFile(path, 'utf8');
const catalog = await readFile('docs/component-catalog.md', 'utf8');

const missingStories = [...registered].filter((tag) => !stories.includes(`<${tag}`));
const missingDocs = [...registered].filter((tag) => !catalog.includes(`\`${tag}\``));
if (missingStories.length || missingDocs.length) {
  const details = [
    missingStories.length ? `Missing Storybook coverage: ${missingStories.join(', ')}` : '',
    missingDocs.length ? `Missing catalog documentation: ${missingDocs.join(', ')}` : '',
  ].filter(Boolean).join('\n');
  throw new Error(details);
}

console.log(`Component contract covers ${registered.size} registered custom elements (stories + docs).`);
