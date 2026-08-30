import { readFile, writeFile } from 'node:fs/promises';

const manifestPaths = [
  'package.json',
  'packages/tokens/package.json',
  'packages/styles/package.json',
  'packages/components/package.json',
  'packages/react/package.json',
  'packages/angular/package.json',
  'storybook/package.json',
  'examples/vanilla/package.json',
  'examples/react/package.json',
  'examples/angular/package.json',
];

const requestedVersion = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!requestedVersion) {
  throw new Error('Expected patch, minor, major, or an explicit semantic version.');
}

const manifests = await Promise.all(
  manifestPaths.map(async (manifestPath) => ({
    manifestPath,
    manifest: JSON.parse(await readFile(manifestPath, 'utf8')),
  })),
);

const currentVersions = new Set(manifests.map(({ manifest }) => manifest.version));
if (currentVersions.size !== 1) {
  throw new Error(`All workspace versions must match; found ${[...currentVersions].join(', ')}.`);
}

const currentVersion = [...currentVersions][0];
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(currentVersion);
if (!match) {
  throw new Error(`Current version ${currentVersion} is not a stable semantic version.`);
}

const [, majorText, minorText, patchText] = match;
const major = Number(majorText);
const minor = Number(minorText);
const patch = Number(patchText);
const nextVersion =
  requestedVersion === 'patch'
    ? `${major}.${minor}.${patch + 1}`
    : requestedVersion === 'minor'
      ? `${major}.${minor + 1}.0`
      : requestedVersion === 'major'
        ? `${major + 1}.0.0`
        : requestedVersion;

if (!/^\d+\.\d+\.\d+$/.test(nextVersion)) {
  throw new Error(`${requestedVersion} is not patch, minor, major, or a stable semantic version.`);
}

const workspacePackageNames = new Set(manifests.map(({ manifest }) => manifest.name));
const dependencySections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

for (const { manifestPath, manifest } of manifests) {
  manifest.version = nextVersion;

  for (const section of dependencySections) {
    for (const dependencyName of Object.keys(manifest[section] ?? {})) {
      if (workspacePackageNames.has(dependencyName)) {
        manifest[section][dependencyName] = nextVersion;
      }
    }
  }

  if (!dryRun) {
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}

console.log(nextVersion);
