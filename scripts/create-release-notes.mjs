import { mkdir, writeFile } from 'node:fs/promises';
import { loadReleasePackages } from './release-config.mjs';

const [version, imageName, imageDigest, outputDirectory] = process.argv.slice(2);
if (!version || !imageName || !imageDigest || !outputDirectory) {
  throw new Error('Expected version, image name, image digest, and output directory.');
}

const packages = (await loadReleasePackages()).map(({ expectedName, manifest }) => ({
  name: expectedName,
  version: manifest.version,
}));

if (packages.some(({ version: packageVersion }) => packageVersion !== version)) {
  throw new Error(`Release version ${version} does not match every package manifest.`);
}

const imageReference = `${imageName}:${version}`;
const immutableImageReference = `${imageName}@${imageDigest}`;
const imageArchive = `kanosis-storybook-${version}-linux-amd64.tar.gz`;

const notes = `## npm packages

${packages.map(({ name }) => `- \`${name}@${version}\``).join('\n')}

Configure \`@endeavoury:registry=https://npm.pkg.github.com\`, authenticate with \`read:packages\`, and install the packages with npm.

## Storybook container

\`\`\`bash
docker pull ${imageReference}
\`\`\`

Immutable image: \`${immutableImageReference}\`

The attached \`${imageArchive}\` is a loadable Linux AMD64 Docker archive:

\`\`\`bash
gzip -dc ${imageArchive} | docker load
\`\`\`

Use \`SHA256SUMS\` to verify the downloadable assets.
`;

const manifest = {
  version,
  tag: `v${version}`,
  commit: process.env.GITHUB_SHA ?? null,
  packages,
  storybookImage: {
    reference: imageReference,
    immutableReference: immutableImageReference,
    digest: imageDigest,
    archive: imageArchive,
    platform: 'linux/amd64',
  },
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(`${outputDirectory}/release-notes.md`, notes),
  writeFile(`${outputDirectory}/release-manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`),
]);
