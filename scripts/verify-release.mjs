import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const packages = [
  ['@finance-design/tokens', 'packages/tokens/package.json'],
  ['@finance-design/styles', 'packages/styles/package.json'],
  ['@finance-design/design-system', 'packages/components/package.json'],
  ['@finance-design/react', 'packages/react/package.json'],
  ['@finance-design/angular', 'packages/angular/package.json'],
];

const releaseTag = process.argv[2];
const manifests = await Promise.all(
  packages.map(async ([expectedName, manifestPath]) => {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

    if (manifest.name !== expectedName) {
      throw new Error(`${manifestPath} must be named ${expectedName}.`);
    }

    if (manifest.private === true) {
      throw new Error(`${expectedName} must be publishable.`);
    }

    if (manifest.publishConfig?.registry !== 'https://npm.pkg.github.com') {
      throw new Error(`${expectedName} must publish to GitHub Packages.`);
    }

    return manifest;
  }),
);

const versions = new Set(manifests.map(({ version }) => version));
if (versions.size !== 1) {
  throw new Error(`All public packages must share one version; found ${[...versions].join(', ')}.`);
}

const [version] = versions;
if (releaseTag && releaseTag !== `v${version}`) {
  throw new Error(`Release tag ${releaseTag} does not match package version v${version}.`);
}

for (const [packageName] of packages) {
  const pack = spawnSync('npm', ['pack', '--dry-run', '--workspace', packageName], {
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (pack.status !== 0) {
    throw new Error(`Package dry run failed for ${packageName}.`);
  }
}

console.log(`Release v${version} is ready for ${packages.length} packages.`);
