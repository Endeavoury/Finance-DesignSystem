import { gzipSync } from 'node:zlib';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const temporary = join(process.cwd(), '.bundle-analysis');
const outputDirectory = join(process.cwd(), 'reports');
await rm(temporary, { recursive: true, force: true });
await mkdir(temporary, { recursive: true });
await mkdir(outputDirectory, { recursive: true });

const entries = {
  button: `import '@endeavoury/kanosis/button';`,
  forms: `import '@endeavoury/kanosis/forms';`,
  secondaryForms: `import '@endeavoury/kanosis/secondary-forms';`,
  interaction: `import '@endeavoury/kanosis/interaction';`,
  overlays: `import '@endeavoury/kanosis/overlays';`,
  upload: `import '@endeavoury/kanosis/upload';`,
  feedback: `import '@endeavoury/kanosis/feedback';`,
  navigation: `import '@endeavoury/kanosis/navigation';`,
  tree: `import '@endeavoury/kanosis/tree';`,
  enterprise: `import '@endeavoury/kanosis/enterprise';`,
  enterpriseP1: `import '@endeavoury/kanosis/enterprise-p1';`,
  enterpriseP2: `import '@endeavoury/kanosis/enterprise-p2';`,
  enterpriseP3: `import '@endeavoury/kanosis/enterprise-p3';`,
  full: `import '@endeavoury/kanosis';`,
};
const budgets = {
  button: { rawBytes: 45000, gzipBytes: 12000 },
  forms: { rawBytes: 70000, gzipBytes: 16500 },
  secondaryForms: { rawBytes: 55000, gzipBytes: 14500 },
  interaction: { rawBytes: 45000, gzipBytes: 12500 },
  overlays: { rawBytes: 55000, gzipBytes: 15000 },
  upload: { rawBytes: 40000, gzipBytes: 11500 },
  feedback: { rawBytes: 55000, gzipBytes: 14500 },
  navigation: { rawBytes: 65000, gzipBytes: 16500 },
  tree: { rawBytes: 45000, gzipBytes: 12500 },
  enterprise: { rawBytes: 70000, gzipBytes: 16000 },
  enterpriseP1: { rawBytes: 90000, gzipBytes: 22000 },
  enterpriseP2: { rawBytes: 90000, gzipBytes: 22000 },
  enterpriseP3: { rawBytes: 90000, gzipBytes: 22000 },
  full: { rawBytes: 380000, gzipBytes: 70000 },
};
const report = { generatedAt: new Date().toISOString(), budgets, bundles: {} };

for (const [name, source] of Object.entries(entries)) {
  const input = join(temporary, `${name}.js`);
  await writeFile(input, source);
  const bundle = await rollup({
    input,
    plugins: [nodeResolve({ browser: true })],
    treeshake: true,
  });
  const generated = await bundle.generate({
    format: 'es',
    inlineDynamicImports: true,
    compact: true,
  });
  await bundle.close();
  const code = generated.output
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n');
  report.bundles[name] = {
    rawBytes: Buffer.byteLength(code),
    gzipBytes: gzipSync(code).byteLength,
  };
  if (report.bundles[name].rawBytes > budgets[name].rawBytes)
    throw new Error(`${name} bundle exceeds its ${budgets[name].rawBytes} B raw budget.`);
  if (report.bundles[name].gzipBytes > budgets[name].gzipBytes)
    throw new Error(`${name} bundle exceeds its ${budgets[name].gzipBytes} B gzip budget.`);
  if (name === 'full') {
    const normalizedCode = code.replace(/\s+/g, '');
    // Anchor the check to the shared `.control` rule. Component-specific motion
    // may intentionally use the same transition sequence without duplicating
    // the shared form-control foundation.
    const sharedControlMarker =
      '.control{min-height:var(--ds-control-height-md);border:1pxsolidvar(--ds-color-border-default)';
    const markerOccurrences = normalizedCode.split(sharedControlMarker).length - 1;
    report.sharedControlFoundationOccurrences = markerOccurrences;
    if (markerOccurrences !== 1)
      throw new Error(
        `Expected one shared control foundation in the full bundle, found ${markerOccurrences}.`,
      );
    const spinnerFoundationOccurrences = normalizedCode.split('@keyframesds-spin').length - 1;
    report.sharedSpinnerFoundationOccurrences = spinnerFoundationOccurrences;
    if (spinnerFoundationOccurrences !== 1)
      throw new Error(
        `Expected one shared spinner foundation in the full bundle, found ${spinnerFoundationOccurrences}.`,
      );
  }
}

await writeFile(join(outputDirectory, 'bundle-sizes.json'), `${JSON.stringify(report, null, 2)}\n`);
await rm(temporary, { recursive: true, force: true });
for (const [name, size] of Object.entries(report.bundles))
  console.log(
    `${name.padEnd(8)} ${String(size.rawBytes).padStart(7)} B raw  ${String(size.gzipBytes).padStart(6)} B gzip`,
  );
console.log(`shared control foundation occurrences: ${report.sharedControlFoundationOccurrences}`);
console.log(`shared spinner foundation occurrences: ${report.sharedSpinnerFoundationOccurrences}`);
