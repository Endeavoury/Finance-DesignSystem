# Versioning and publishing

The five public `@endeavoury/kanosis*` packages and all private workspaces use
one synchronized semantic version. The current baseline is `1.0.0`. Fixes use
patch releases, additive changes use minor releases, and breaking changes use
major releases.

## Automatic release branches

GitHub Actions selects the semantic increment from the branch receiving the
commit:

| Branch          | Increment | Example           |
| --------------- | --------- | ----------------- |
| `main`          | patch     | `1.0.0` → `1.0.1` |
| `release/minor` | minor     | `1.0.1` → `1.1.0` |
| `release/major` | major     | `1.1.0` → `2.0.0` |

Create the release branches from the latest `main` when they are first needed:

```bash
git switch main
git pull --ff-only
git switch -c release/minor
git push -u origin release/minor

git switch main
git switch -c release/major
git push -u origin release/major
```

Each pushed commit runs the complete quality gate, updates every workspace
manifest and exact internal dependency, commits the synchronized version,
creates the matching `v<version>` tag, and publishes the release. The generated
version commit contains `[skip release]` so it cannot recursively create
another release. Merge a completed minor or major release branch back into
`main` before continuing patch releases from the new version line.

The workflow can also be run manually from GitHub Actions with an explicit
patch, minor, or major increment. Manual runs are intended for controlled
releases and recovery; normal releases should use the branch policy above.

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
2. Ensure branch protection permits `github-actions[bot]` to push the generated
   version commit and tag to the three release branches.
3. After the first release, set npm and container package visibility and
   inherited repository access as required in GitHub Packages.

The committed `.npmrc` only maps the `@endeavoury` scope to GitHub Packages. It
contains no credentials; GitHub Actions injects authentication at runtime.

## Release checklist

1. Choose `main`, `release/minor`, or `release/major` for the intended change.
2. Run `npm ci` and `npm run check` locally.
3. Review the generated bundle report and Storybook screens.
4. Commit and push the change to the selected branch.
5. Confirm the GitHub Actions release and merge a minor or major branch back to
   `main` after publication.

The workflow verifies that the generated tag and package versions match and
inspects each tarball with `npm pack --dry-run`. It then publishes in this
dependency order:

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
gzip -dc kanosis-storybook-1.0.1-linux-amd64.tar.gz | docker load
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
