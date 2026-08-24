import { readFile } from 'node:fs/promises';

export const registry = 'https://npm.pkg.github.com';

export const releasePackages = [
  ['@finance-design/tokens', 'packages/tokens/package.json'],
  ['@finance-design/styles', 'packages/styles/package.json'],
  ['@finance-design/design-system', 'packages/components/package.json'],
  ['@finance-design/react', 'packages/react/package.json'],
  ['@finance-design/angular', 'packages/angular/package.json'],
];

export async function loadReleasePackages() {
  return Promise.all(
    releasePackages.map(async ([expectedName, manifestPath]) => {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      return { expectedName, manifestPath, manifest };
    }),
  );
}
