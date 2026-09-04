import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const argumentsWithoutFlags = process.argv.slice(2).filter((argument) => !argument.startsWith('--'));
const inputPath = argumentsWithoutFlags[0];
if (!inputPath) {
  throw new Error('Usage: npm run penpot:sync -- path/to/export.json');
}

const cssPath = fileURLToPath(new URL('../packages/tokens/src/tokens.css', import.meta.url));
const source = await readFile(cssPath, 'utf8');
const exported = JSON.parse(await readFile(inputPath, 'utf8'));
if (!Array.isArray(exported.sets)) {
  throw new Error('Penpot export must contain a sets array of { selector, values }.');
}

const known = new Set([...source.matchAll(/(--ds-[a-z0-9-]+):\s*[^;]+;/g)].map((match) => match[1]));
const deprecated = new Set([
  '--ds-breakpoint-mobile',
  '--ds-breakpoint-tablet',
  '--ds-breakpoint-desktop',
]);
let next = source;
let updates = 0;

const normalizeSelector = (selector) => selector.replace(/\s+/g, ' ').trim();
for (const set of exported.sets) {
  if (typeof set.selector !== 'string' || !set.values || typeof set.values !== 'object')
    throw new Error('Each set needs a CSS selector and token-value object.');
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  let matched = false;
  next = next.replace(blockPattern, (block, selector, body) => {
    if (normalizeSelector(selector) !== normalizeSelector(set.selector)) return block;
    matched = true;
    let changedBody = body;
    for (const [name, value] of Object.entries(set.values)) {
      if (!known.has(name)) throw new Error(`Unknown design token in Penpot export: ${name}`);
      if (deprecated.has(name)) throw new Error(`Deprecated design token in Penpot export: ${name}`);
      if (typeof value !== 'string' || !value.trim())
        throw new Error(`Design token ${name} must have a non-empty CSS value.`);
      const declaration = new RegExp(`(${name.replaceAll('-', '\\-')}:\\s*)([^;]+)(;)`);
      if (!declaration.test(changedBody))
        throw new Error(`Token ${name} is not declared in selector ${set.selector}.`);
      changedBody = changedBody.replace(declaration, `$1${value.trim()}$3`);
      updates += 1;
    }
    return `${selector}{${changedBody}}`;
  });
  if (!matched) throw new Error(`Selector from Penpot export was not found: ${set.selector}`);
}

if (process.argv.includes('--write')) {
  await writeFile(cssPath, next);
  console.log(`Applied ${updates} reviewed Penpot token values to tokens.css.`);
} else {
  console.log(`Validated ${updates} Penpot token values; rerun with --write to apply.`);
}
