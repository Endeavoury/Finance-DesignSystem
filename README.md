# Finance Design System

A standalone, framework-independent design system for technical and financial management interfaces. Lit Web Components are the only component implementation; Vanilla JavaScript, React, and Angular consume those same custom elements.

![Finance Inzicht application and design-system example](docs/images/finance-workspace-example.png)

This repository is independent of the Finance Inzicht application. It has no application imports, API clients, authentication, or financial business logic.

## Quick start

```bash
npm install
npm run storybook
```

Storybook is the primary review environment. It contains foundations, every production component, reusable patterns, and representative Finance Inzicht screens using mock data.

Build and run the standalone Storybook with Docker Compose:

```bash
docker compose up --build
```

Open `http://localhost:6006`.

Set `DESIGN_SYSTEM_PORT` when port 6006 is already in use:

```bash
DESIGN_SYSTEM_PORT=6010 docker compose up --build
```

Run the complete quality gate with:

```bash
npm run check
```

## Finance Inzicht integration

Finance Inzicht consumes this repository as a sibling checkout. Package
history, releases, CI, and working trees remain fully independent while a
shared parent directory lets local tools and Codex inspect both codebases.

```text
Finance-Inzicht/
├── application/  → Endeavoury/Finance-Inzicht
└── design/       → Endeavoury/Finance-DesignSystem
```

The application repository provides `scripts/setup-workspace.sh`, which clones
or updates this repository in the expected `design/` directory and prepares
both Node workspaces. Changes are committed and pushed directly from the
relevant sibling repository; there is no submodule pointer to update.

## Packages

| Package                         | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `@finance-design/tokens`        | Semantic CSS tokens and typed token metadata                  |
| `@finance-design/styles`        | Opt-in global CSS and shared Lit style foundations            |
| `@finance-design/design-system` | Web Component classes and registration entry points           |
| `@finance-design/react`         | Thin typed React adapters around the Web Components           |
| `@finance-design/angular`       | Angular schema/registration helpers; no visual implementation |

Published packages are hosted by GitHub Packages. Consumers authenticate with
a token that has `read:packages`, then map the scope in their project or user
`.npmrc`:

```ini
@finance-design:registry=https://npm.pkg.github.com
```

```bash
npm install @finance-design/design-system
```

## Usage

```ts
import '@finance-design/design-system';
import '@finance-design/design-system/styles.css';
```

```html
<ds-button variant="primary">Save</ds-button>
<ds-input label="Device name" name="deviceName"></ds-input>
<ds-status-badge tone="success">Online</ds-status-badge>
```

Register only a group when bundle size matters:

```ts
import '@finance-design/design-system/button';
import '@finance-design/design-system/forms';
```

The global stylesheet is intentionally opt-in. It installs tokens, theme defaults, typography, page colors, a small box-sizing normalization, and a few documented layout helpers. It does not restyle arbitrary buttons, inputs, headings, or links.

## Documentation

- [Architecture](docs/architecture.md)
- [Current-product UI inventory](docs/ui-inventory.md)
- [Component roadmap and gap analysis](docs/component-roadmap.md)
- [Using components and framework adapters](docs/usage.md)
- [Theming and styling](docs/theming-and-styling.md)
- [Development and testing](docs/development.md)
- [Bundle architecture and measured sizes](docs/bundle-size.md)
- [Versioning and publishing](docs/publishing.md)

## Browser baseline

The package targets current evergreen browsers with Custom Elements, Shadow DOM, ElementInternals, CSS custom properties, and constructable stylesheet support. Consumers supporting older browsers must supply appropriate platform polyfills and validate form-associated behavior in their browser matrix.
