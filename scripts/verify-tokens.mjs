import { glob, readFile } from 'node:fs/promises';

const tokenCss = await readFile('packages/tokens/src/tokens.css', 'utf8');
const globalDefinitions = new Set(
  [...tokenCss.matchAll(/(--ds-[a-z0-9-]+):/g)].map((match) => match[1]),
);
const references = new Set();
const localDefinitions = new Set();
const errors = [];

for await (const path of glob([
  'packages/components/src/**/*.ts',
  'packages/styles/src/**/*.{ts,css}',
])) {
  const source = await readFile(path, 'utf8');
  for (const match of source.matchAll(/var\((--ds-[a-z0-9-]+)/g)) references.add(match[1]);
  for (const match of source.matchAll(/(--ds-[a-z0-9-]+):/g)) localDefinitions.add(match[1]);
  for (const match of source.matchAll(/var\((--ds-[a-z0-9-]+),/g)) localDefinitions.add(match[1]);
  if (/#[0-9a-f]{3,8}\b|(?:rgb|hsl)a?\(/i.test(source))
    errors.push(`${path}: raw color value; use a token`);
  for (const match of source.matchAll(/(?:animation|transition)[^;\n]*(\d+(?:\.\d+)?(?:ms|s))/g)) {
    if (match[1] !== '0s') errors.push(`${path}: raw motion duration ${match[1]}; use a token`);
  }
}

for (const reference of references) {
  if (!globalDefinitions.has(reference) && !localDefinitions.has(reference))
    errors.push(`Unknown design token reference: ${reference}`);
}

if (errors.length) throw new Error([...new Set(errors)].join('\n'));
console.log(
  `Token usage verified (${globalDefinitions.size} global tokens, ${references.size} references).`,
);
