# Versioning and publishing

The five public `@endeavoury/kanosis*` packages use one synchronized semantic version. During the pre-1.0 phase, breaking API changes increment the minor version. After 1.0, breaking changes increment major, additive changes minor, and fixes patch.

Packages are published to GitHub Packages and linked to
`Endeavoury/Kanosis` through their `repository` metadata. GitHub
Packages requires a scoped npm name and authenticated package access.

## One-time repository setup

The source repository and all packages belong to the `Endeavoury` GitHub
account. The release workflow therefore publishes both npm packages and the
Storybook container with the repository's automatic `GITHUB_TOKEN`; no
separate account or publishing secret is required.

1. Ensure repository Actions settings allow workflows to write packages and
   repository contents.
2. After the first release, set npm and container package visibility and
   inherited repository access as required in GitHub Packages.

The committed `.npmrc` only maps the `@endeavoury` scope to GitHub Packages. It
contains no credentials; GitHub Actions injects authentication at runtime.

## Release checklist

1. Update the changelog and all five package versions together.
2. Update exact internal dependency versions to the same release.
3. Run `npm ci`, `npm run check`, and `npm run release:verify`.
4. Review the generated bundle report, package dry runs, and Storybook screens.
5. Commit and push the release changes to `main`.
6. Create and push a tag whose name is exactly `v<version>`:

   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

The tag starts `.github/workflows/release.yml`. The workflow runs the complete
quality gate, verifies that the tag and package versions match, and inspects
each tarball with `npm pack --dry-run`. It then publishes in this dependency
order:

1. `@endeavoury/kanosis-tokens`
2. `@endeavoury/kanosis-styles`
3. `@endeavoury/kanosis`
4. `@endeavoury/kanosis-react`
5. `@endeavoury/kanosis-angular`

The same workflow builds the standalone Storybook image and publishes it as:

```text
ghcr.io/endeavoury/kanosis-storybook:<version>
ghcr.io/endeavoury/kanosis-storybook:v<version>
ghcr.io/endeavoury/kanosis-storybook:sha-<commit>
ghcr.io/endeavoury/kanosis-storybook:latest
```

The image is limited to `linux/amd64` so the registry image and downloadable
Docker archive describe the same platform. GitHub Actions generates a signed
provenance attestation for the pushed image and for the downloadable release
assets.

After npm and container publication succeed, CI creates the GitHub Release. It
contains:

- one `.tgz` tarball for each npm package;
- a loadable `kanosis-storybook-<version>-linux-amd64.tar.gz` image;
- the immutable GHCR digest;
- `release-manifest.json` with package and image references;
- `SHA256SUMS` for every downloadable artifact.

Load the attached image archive without contacting the registry:

```bash
gzip -dc kanosis-storybook-0.1.0-linux-amd64.tar.gz | docker load
```

The workflow is safe to rerun: published npm versions are detected and
skipped, container tags are rebuilt from the same tagged source, and existing
release assets are replaced.

Workspace dependencies use exact matching versions so a release is reproducible. Public package exports expose only intentional entry points. Build output, source declarations, CSS assets, and package READMEs are included; tests, Storybook, examples, and application code are not.

## Installing from GitHub Packages

Add the registry mapping to the consuming project's `.npmrc`:

```ini
@endeavoury:registry=https://npm.pkg.github.com
```

Authenticate with a classic personal access token that has `read:packages`,
then install normally:

```bash
npm install @endeavoury/kanosis
```

The Finance Inzicht sibling workspace intentionally uses local `file:`
dependencies so changes can be developed across both repositories before a
release is published.
