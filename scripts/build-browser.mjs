import { mkdir } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const outputDirectory = new URL('../packages/components/dist/browser/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

const bundle = await rollup({
  input: fileURLToPath(new URL('../packages/components/dist/index.js', import.meta.url)),
  plugins: [nodeResolve({ browser: true })],
});

await bundle.write({
  file: fileURLToPath(new URL('design-system.js', outputDirectory)),
  format: 'es',
  sourcemap: true,
});
await bundle.close();
