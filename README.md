# Finance Inzicht Design System

A standalone, framework-independent design system for technical and financial management interfaces. Lit Web Components are the only component implementation; Vanilla JavaScript, React, and Angular consume those same custom elements.

This repository is independent of the Finance Inzicht application. It has no application imports, API clients, authentication, or financial business logic.

## Quick start

```bash
npm install
npm run storybook
```

Storybook is the primary review environment. It contains foundations, every production component, reusable patterns, and representative Finance Inzicht screens using mock data.

Build and run the standalone Storybook container with:

```bash
docker build -t finance-design-system .
docker run --rm -p 6006:8080 finance-design-system
```

Open `http://localhost:6006`.

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

| Package                          | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `@finance-inzicht/tokens`        | Semantic CSS tokens and typed token metadata                  |
| `@finance-inzicht/styles`        | Opt-in global CSS and shared Lit style foundations            |
| `@finance-inzicht/design-system` | Web Component classes and registration entry points           |
| `@finance-inzicht/react`         | Thin typed React adapters around the Web Components           |
| `@finance-inzicht/angular`       | Angular schema/registration helpers; no visual implementation |

## Usage

```ts
import '@finance-inzicht/design-system';
import '@finance-inzicht/design-system/styles.css';
```

```html
<ds-button variant="primary">Save</ds-button>
<ds-input label="Device name" name="deviceName"></ds-input>
<ds-status-badge tone="success">Online</ds-status-badge>
```

Register only a group when bundle size matters:

```ts
import '@finance-inzicht/design-system/button';
import '@finance-inzicht/design-system/forms';
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
