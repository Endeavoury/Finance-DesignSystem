#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const name = process.argv[2];
if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('Usage: node scripts/scaffold-component.mjs <component-name>');
  process.exit(1);
}

const root = join('packages/components/src/components', name);
await mkdir(root, { recursive: true });
const className = `Ds${name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;
const tag = `ds-${name}`;
await writeFile(join(root, `${name}.ts`), `import { LitElement, html } from 'lit';\n\nexport class ${className} extends LitElement {\n  render() { return html\`<slot></slot>\`; }\n}\n`);
await writeFile(join(root, `${name}.scss`), `:host {\n  display: block;\n}\n`);
await writeFile(join(root, `${name}.html`), `<${tag}></${tag}>\n`);
await writeFile(join(root, 'register.ts'), `import { defineComponent } from '../../core/ds-element.js';\nimport { ${className} } from './${name}.js';\n\ndefineComponent('${tag}', ${className});\nexport { ${className} };\n`);
console.log(`Scaffolded ${basename(root)} at ${root}`);
