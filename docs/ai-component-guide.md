# AI component guide

This is the shortest path for an agent (Codex, Copilot, or another code-generation tool) to understand and use Kanosis components.

## Discover the complete catalog

Run this from the repository root:

```bash
npm run components:list -- --json
```

The command reads the TypeScript registration files and returns a stable JSON index containing each custom-element tag, class, implementation source, registration entry point, Storybook story, and documentation catalog. The human-readable form is available with `npm run components:list`.

For API details, open the implementation path from the index and inspect the exported interface immediately above the class. Lit `@property` declarations are the public properties; named `<slot>` elements are the slots; `dispatchEvent` calls are the event contract.

## Choose an import

Use the package root when an application needs the complete catalog:

```ts
import '@endeavoury/kanosis';
```

Prefer a narrow registration entry point when only a family is needed:

```ts
import '@endeavoury/kanosis/enterprise-p2';
```

The index output is authoritative for available entry points. Class-only consumers can import from `@endeavoury/kanosis/classes` without registering custom elements.

## Use a component safely

1. Read its Storybook story first; it shows required attributes, slots, events, and realistic composition.
2. Read the implementation and its exported types.
3. Preserve `min-width: 0` and `min-height: 0` when placing panes or scrollable components in flex/grid layouts.
4. Use the documented custom events rather than reaching into shadow DOM internals.
5. Add or update the component story, catalog entry, and tests when changing behavior.

Every registered element is required to have Storybook coverage and a catalog documentation entry. `npm run verify:components` enforces that contract.
