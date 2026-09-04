import { glob, readFile } from 'node:fs/promises';

const registered = new Set();
for await (const path of glob('packages/components/src/register/*.ts')) {
  const source = await readFile(path, 'utf8');
  for (const match of source.matchAll(/defineComponent\('([^']+)'/g)) registered.add(match[1]);
}

let stories = '';
for await (const path of glob('storybook/stories/**/*.stories.ts'))
  stories += await readFile(path, 'utf8');
const catalog = await readFile('docs/component-catalog.md', 'utf8');
const manifest = JSON.parse(await readFile('docs/component-status.json', 'utf8'));

const missingStories = [...registered].filter((tag) => !stories.includes(`<${tag}`));
const missingDocs = [...registered].filter((tag) => !catalog.includes(`\`${tag}\``));
const manifestTags = new Set(manifest.components.map((component) => component.tag));
const missingStatus = [...registered].filter((tag) => !manifestTags.has(tag));
const unknownStatus = [...manifestTags].filter((tag) => !registered.has(tag));
const incompleteStatus = manifest.components.filter(
  (component) =>
    !component.owner ||
    !component.adoption?.state ||
    !component.documentation?.catalog ||
    !Array.isArray(component.documentation?.stories) ||
    !component.stateCoverage ||
    !component.readiness,
);
if (
  missingStories.length ||
  missingDocs.length ||
  missingStatus.length ||
  unknownStatus.length ||
  incompleteStatus.length
) {
  const details = [
    missingStories.length ? `Missing Storybook coverage: ${missingStories.join(', ')}` : '',
    missingDocs.length ? `Missing catalog documentation: ${missingDocs.join(', ')}` : '',
    missingStatus.length ? `Missing maturity status: ${missingStatus.join(', ')}` : '',
    unknownStatus.length ? `Unknown maturity entries: ${unknownStatus.join(', ')}` : '',
    incompleteStatus.length
      ? `Incomplete maturity metadata: ${incompleteStatus.map((component) => component.tag).join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
  throw new Error(details);
}

console.log(
  `Component contract covers ${registered.size} registered custom elements (stories + docs).`,
);
