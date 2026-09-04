# Development, Storybook, and testing

## Commands

```bash
npm run storybook       # interactive review
npm run typecheck       # project-reference TypeScript check
npm test                # Web Component behavior and accessibility
npm run build           # packages and three framework examples
npm run build-storybook # static documentation build
npm run analyze         # representative bundle sizes and CSS reuse assertion
npm run check           # complete local/CI quality gate
```

Storybook renders shipped Web Components directly with Lit templates. Global controls switch Light, Dark, and System themes. Named mobile, tablet, laptop, desktop, and wide viewports are configured. The accessibility addon runs WCAG-oriented checks; do not suppress a rule without documenting an upstream limitation and adding a replacement test.

## Component-first source layout

Components stay TypeScript-first in this repository. Lit templates and styles are authored in TypeScript so they are type-checked and emitted as the package's JavaScript artifact. New components should still be grouped by component rather than by implementation detail:

```text
packages/components/src/components/<component>/
  <component>.ts          # Lit element, public types, and composed styles
  <component>.scss        # design-source stylesheet (kept beside the element)
  <component>.html        # semantic anatomy/fixture markup
  register.ts             # defineComponent + public registration exports
storybook/stories/components/<component>.stories.ts
docs/components/<component>.md
```

The `.ts` file is the canonical source; the build emits `.js` and `.d.ts` files to `dist`. The SCSS and HTML files are design/source artifacts and fixtures, not a second runtime implementation. `scripts/scaffold-component.mjs` creates this complete set for a new component.

Every registered custom element must have all of the following:

- a component implementation and narrow registration entry point;
- a Storybook story that renders the element (including an autodocs page);
- a documentation entry in `docs/component-catalog.md` linking to its story family;
- behavior and accessibility coverage where the element has interaction.

Run `npm run verify:components` to enforce this contract locally and in CI.

## Adding a component

1. Classify it as primitive, component, pattern, or application business feature. Business features do not belong here.
2. Check whether each style belongs in tokens, a shared style foundation, or the component-specific sheet.
3. Add the Lit element without registering it in `classes.ts`.
4. Add it to the narrowest registration entry point and to the full entry point.
5. Define standards-oriented attributes/properties, slots, stable parts, and typed bubbling/composed events.
6. Add stories for meaningful variants, boundaries, keyboard behavior, responsive layouts, and both themes.
7. Add behavior and accessibility tests against the real custom element.
8. Update package exports and documentation when a new public entry point is introduced.
9. Add the component to `docs/component-catalog.md` (the verifier reports the exact missing tag).

## Adding tokens or shared styles

Add raw scale values and semantic aliases to the tokens package, then document them in a Foundations story. A shared Lit style belongs in the styles package only when several components use the same behavioral or visual convention. Avoid catch-all foundations that make individual component bundles expensive.

## Test strategy

- Vitest + Happy DOM: element lifecycle, attributes/properties, custom events, slots, keyboard behavior, selection/sorting, and form internals where the environment supports them.
- axe-core: automated semantic checks on representative rendered compositions.
- Storybook a11y: interactive and composed-state inspection.
- Cross-framework smoke coverage: the native contract test exercises Vanilla-style attributes, properties, slots, forms, events, and theme inheritance; React has a runtime adapter test; React and Angular examples compile against the actual published entry points and Angular template bindings.
- Storybook static build: validates every story import and docs configuration.
- Bundle analysis: measures minified full and individual imports, gzipped output, and shared-style marker duplication.

Visual regression is prepared for local/CI use through the deterministic static Storybook build. A screenshot runner can be attached to the generated `storybook-static` output without a paid service; project-specific baseline ownership should be established before committing binary snapshots.
