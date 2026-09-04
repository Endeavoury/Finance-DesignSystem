#!/usr/bin/env node

import { glob, readFile } from 'node:fs/promises';
import { relative } from 'node:path';

const registrations = new Map();
for await (const path of glob('packages/components/src/register/*.ts')) {
  const source = await readFile(path, 'utf8');
  const imports = new Map();
  for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](\.\.\/components\/[^'"]+)['"]/g)) {
    for (const name of match[1].split(',').map((value) => value.trim()).filter(Boolean)) imports.set(name, match[2]);
  }
  for (const match of source.matchAll(/defineComponent\('([^']+)',\s*(\w+)\)/g)) {
    registrations.set(match[1], {
      tag: match[1],
      className: match[2],
      registration: relative('.', path),
      implementation: imports.get(match[2]) ?? null,
    });
  }
}

const storyFiles = [];
for await (const path of glob('storybook/stories/**/*.stories.ts')) {
  storyFiles.push(path);
}
for (const component of registrations.values()) {
  const matchingStories = [];
  for (const path of storyFiles) {
    if ((await readFile(path, 'utf8')).includes(`<${component.tag}`)) matchingStories.push(relative('.', path));
  }
  component.stories = matchingStories;
  component.documentation = 'docs/component-catalog.md';
  component.package = '@endeavoury/kanosis';
}

const output = [...registrations.values()].sort((a, b) => a.tag.localeCompare(b.tag));
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ schemaVersion: 1, generatedBy: 'scripts/list-components.mjs', components: output }, null, 2));
} else {
  console.log('Tag | Implementation | Registration | Storybook');
  console.log('--- | --- | --- | ---');
  for (const component of output) console.log(`${component.tag} | ${component.implementation ?? 'inspect registration'} | ${component.registration} | ${component.stories.join(', ')}`);
}
