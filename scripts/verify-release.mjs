import { spawnSync } from 'node:child_process';
import { loadReleasePackages, registry, releasePackages } from './release-config.mjs';

const releaseTag = process.argv[2];
const packages = await loadReleasePackages();
const manifests = packages.map(({ expectedName, manifestPath, manifest }) => {
  if (manifest.name !== expectedName) {
    throw new Error(`${manifestPath} must be named ${expectedName}.`);
  }

  if (manifest.private === true) {
    throw new Error(`${expectedName} must be publishable.`);
  }

  if (manifest.publishConfig?.registry !== registry) {
    throw new Error(`${expectedName} must publish to GitHub Packages.`);
  }

  return manifest;
});

const versions = new Set(manifests.map(({ version }) => version));
if (versions.size !== 1) {
  throw new Error(`All public packages must share one version; found ${[...versions].join(', ')}.`);
}

const [version] = versions;
if (releaseTag && releaseTag !== `v${version}`) {
  throw new Error(`Release tag ${releaseTag} does not match package version v${version}.`);
}

for (const [packageName] of releasePackages) {
  const pack = spawnSync('npm', ['pack', '--dry-run', '--workspace', packageName], {
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (pack.status !== 0) {
    throw new Error(`Package dry run failed for ${packageName}.`);
  }
}

console.log(`Release v${version} is ready for ${releasePackages.length} packages.`);
