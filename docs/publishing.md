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
4. After the first release, set package visibility and inherited repository
   access as required in GitHub Packages.

Do not commit the token to `.npmrc`. The committed file only maps the package
scope to the registry; GitHub Actions injects authentication at runtime.

## Release checklist

1. Update the changelog and all five package versions together.
2. Update exact internal dependency versions to the same release.
3. Run `npm ci`, `npm run check`, and `npm run release:verify`.
4. Review the generated bundle report, package dry runs, and Storybook screens.
5. Commit and push the release changes.
6. Create and publish a GitHub release whose tag is exactly `v<version>`.

Publishing the GitHub release starts `.github/workflows/publish.yml`. The job
runs the complete quality gate, verifies that the tag and package versions
match, inspects each tarball with `npm pack --dry-run`, then publishes in this
dependency order:

1. `@finance-design/tokens`
2. `@finance-design/styles`
3. `@finance-design/design-system`
4. `@finance-design/react`
5. `@finance-design/angular`

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
