# Versioning and publishing

The five public `@finance-design/*` packages use one synchronized semantic version. During the pre-1.0 phase, breaking API changes increment the minor version. After 1.0, breaking changes increment major, additive changes minor, and fixes patch.

Packages are published to GitHub Packages and linked to
`Endeavoury/Finance-DesignSystem` through their `repository` metadata. GitHub
Packages requires a scoped npm name and authenticated package access.

## One-time repository setup

The `@finance-design` namespace belongs to the separate GitHub account
`finance-design`, while the source repository belongs to `Endeavoury`.
Consequently, the repository's automatic `GITHUB_TOKEN` cannot publish this
scope by itself.

1. Grant the `finance-design` GitHub account write access to
   `Endeavoury/Finance-DesignSystem`.
2. Create a classic personal access token for that account with
   `read:packages` and `write:packages`.
3. Add it to the design-system repository as the Actions secret
   `FINANCE_DESIGN_PACKAGES_TOKEN`.
4. Ensure repository Actions settings allow workflows to write packages and
   repository contents.
5. After the first release, set npm and container package visibility and
   inherited repository access as required in GitHub Packages.

Do not commit the token to `.npmrc`. The committed file only maps the package
scope to the registry; GitHub Actions injects authentication at runtime.

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

1. `@finance-design/tokens`
2. `@finance-design/styles`
3. `@finance-design/design-system`
4. `@finance-design/react`
5. `@finance-design/angular`

The same workflow builds the standalone Storybook image and publishes it as:

```text
ghcr.io/endeavoury/finance-design-system-storybook:<version>
ghcr.io/endeavoury/finance-design-system-storybook:v<version>
ghcr.io/endeavoury/finance-design-system-storybook:sha-<commit>
ghcr.io/endeavoury/finance-design-system-storybook:latest
```

The image is limited to `linux/amd64` so the registry image and downloadable
Docker archive describe the same platform. GitHub Actions generates a signed
provenance attestation for the pushed image and for the downloadable release
assets.

After npm and container publication succeed, CI creates the GitHub Release. It
contains:

- one `.tgz` tarball for each npm package;
- a loadable `finance-design-storybook-<version>-linux-amd64.tar.gz` image;
- the immutable GHCR digest;
- `release-manifest.json` with package and image references;
- `SHA256SUMS` for every downloadable artifact.

Load the attached image archive without contacting the registry:

```bash
gzip -dc finance-design-storybook-0.1.0-linux-amd64.tar.gz | docker load
```

The workflow is safe to rerun: published npm versions are detected and
skipped, container tags are rebuilt from the same tagged source, and existing
release assets are replaced.

Workspace dependencies use exact matching versions so a release is reproducible. Public package exports expose only intentional entry points. Build output, source declarations, CSS assets, and package READMEs are included; tests, Storybook, examples, and application code are not.

## Installing from GitHub Packages

Add the registry mapping to the consuming project's `.npmrc`:

```ini
@finance-design:registry=https://npm.pkg.github.com
```

Authenticate with a classic personal access token that has `read:packages`,
then install normally:

```bash
npm install @finance-design/design-system
```

The Finance Inzicht sibling workspace intentionally uses local `file:`
dependencies so changes can be developed across both repositories before a
release is published.
