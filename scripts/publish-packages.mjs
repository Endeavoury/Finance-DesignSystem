import { spawnSync } from 'node:child_process';
import { loadReleasePackages, registry } from './release-config.mjs';

function runNpm(arguments_, options = {}) {
  return spawnSync('npm', arguments_, {
    encoding: 'utf8',
    ...options,
  });
}

for (const { expectedName, manifest } of await loadReleasePackages()) {
  const packageVersion = `${expectedName}@${manifest.version}`;
  const existing = runNpm(['view', packageVersion, 'version', '--registry', registry]);

  if (existing.status === 0 && existing.stdout.trim() === manifest.version) {
    console.log(`${packageVersion} is already published; skipping.`);
    continue;
  }

  const lookupOutput = `${existing.stdout}\n${existing.stderr}`;
  if (existing.status !== 0 && !lookupOutput.includes('E404')) {
    process.stderr.write(lookupOutput);
    throw new Error(`Unable to determine whether ${packageVersion} already exists.`);
  }

  const publish = runNpm(['publish', '--workspace', expectedName, '--registry', registry], {
    stdio: 'inherit',
  });

  if (publish.status !== 0) {
    throw new Error(`Publishing ${packageVersion} failed.`);
  }
}
