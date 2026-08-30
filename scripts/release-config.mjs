import { readFile } from 'node:fs/promises';

export const registry = 'https://npm.pkg.github.com';

export const releasePackages = [
  ['@endeavoury/kanosis-tokens', 'packages/tokens/package.json'],
  ['@endeavoury/kanosis-styles', 'packages/styles/package.json'],
  ['@endeavoury/kanosis', 'packages/components/package.json'],
  ['@endeavoury/kanosis-react', 'packages/react/package.json'],
  ['@endeavoury/kanosis-angular', 'packages/angular/package.json'],
];

export async function loadReleasePackages() {
  return Promise.all(
    releasePackages.map(async ([expectedName, manifestPath]) => {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      return { expectedName, manifestPath, manifest };
    }),
  );
}
