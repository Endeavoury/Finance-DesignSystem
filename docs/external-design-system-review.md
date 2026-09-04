# External design-system review

**Status:** Recommendation  
**Reviewed:** 4 September 2026  
**Systems:** Bootstrap 5.3, Material Design 3, GitHub Primer, and Atlassian Design
System

## Executive conclusion

Kanosis does not need another broad component expansion. It already has a strong
framework-independent architecture and 118 registered custom elements. Its next maturity step is
to make the existing catalog easier to trust, choose, combine, and evolve.

The four reviewed systems are better than Kanosis in different areas:

| System                  | What it does better                                                              | Best lesson for Kanosis                                 | Adoption priority                    |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| GitHub Primer           | Web-product guidance, component maturity, responsive and accessibility detail    | Prove component quality and publish task-level guidance | P0                                   |
| Atlassian Design System | Token governance, content design, messaging, and complex interaction guidance    | Enforce foundations and document end-to-end behavior    | P0                                   |
| Material Design 3       | Coherent visual roles, interaction states, semantic motion, and adaptive layouts | Turn raw scales into intent-based design rules          | P1, with P0 responsive work          |
| Bootstrap 5.3           | Responsive layout tooling, customization surface, examples, and discoverability  | Offer a predictable responsive composition vocabulary   | P1, with P0 breakpoint consolidation |

This is not a recommendation to copy their appearance or runtime architecture. Kanosis should keep
its semantic tokens, Lit Web Components, Shadow DOM, `ds-*` events, selective registration, and thin
React and Angular integrations.

## Scope and method

The review compares official public documentation, not visual similarity or raw component counts.
It evaluates four layers:

- **Foundation:** tokens and rules for color, type, spacing, layout, elevation, motion, density, and
  accessibility preferences.
- **Component:** a reusable interactive or presentational building block with a stable contract.
- **Pattern:** task-level guidance that combines components, content, state, and behavior.
- **Change:** governance, documentation, testing, migration, or contribution work that improves the
  system itself.

Priority means:

- **P0 — do before further catalog growth:** fixes a current correctness, accessibility, or trust gap.
- **P1 — next planned increment:** high product value after the P0 quality baseline exists.
- **P2 — validate first:** useful only after a real product use case or adoption signal exists.

## Kanosis baseline

### Current strengths

- One Web Component implementation serves Vanilla JavaScript, React, and Angular.
- Semantic light, dark, and system themes cross Shadow DOM through CSS custom properties.
- Registration is guarded and split into selective entry points.
- The catalog covers core controls, enterprise data workflows, navigation, overlays, feedback,
  auditing, administration, and developer tools.
- Storybook presence and catalog presence are checked for every registered element.
- Reduced motion, native semantics, composed events, bundle analysis, and automated axe checks are
  already part of the quality approach.

### Current risks found in the repository

| Finding                                          | Evidence                                                                                                                                                           | Consequence                                                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadth has outpaced maturity evidence           | `npm run components:list` now reports 118 elements; the status manifest exposes incomplete behavior, visual, and accessibility matrices instead of treating registration as readiness             | A tag can be “covered” without its states, keyboard model, zoom, high contrast, or screen-reader behavior being verified                                   |
| Catalog entries are discoverable but shallow     | `docs/component-catalog.md` is mostly grouped tag names linked to source stories                                                                                   | Consumers cannot consistently find anatomy, selection guidance, content rules, responsive behavior, accessibility requirements, status, or migration notes |
| Typed and runtime token sources have drifted     | `tokens.css` defines radii of 6/9/14px and motion durations of 140/220ms; `index.ts` describes 4/7/10px and 120/180ms                                              | Design tools and code can make different decisions while appearing to use the same token                                                                   |
| Breakpoint intent is not executable consistently | Typed breakpoint entries coexist with hard-coded component queries at 380, 560, 600, 640, 680, 760, 800, 900, and 1100px                                           | Similar layouts change at different widths without a documented reason                                                                                     |
| Accessibility preferences are incomplete         | Reduced motion is covered, but no repository guidance or tests were found for `forced-colors`, `prefers-contrast`, RTL, browser text-size changes, or text spacing | Components may pass axe while still failing common low-vision, high-contrast, localization, or reflow scenarios                                            |
| Historical roadmap language is stale             | Older review documents still describe delivered components as the next breadth tier                                                                                | Maintainers can prioritize duplicate work instead of hardening the current catalog                                                                         |

Story presence remains useful; it should be treated as discoverability, not proof of production
readiness.

## Review by source system

### Bootstrap 5.3

Bootstrap is better at giving a developer a complete, predictable responsive vocabulary. Its
mobile-first grid has six documented tiers, responsive containers, columns, gutters, and examples.
Its utility API makes the same vocabulary extensible, while root and component CSS variables expose
a wide customization surface. The examples make common page arrangements easy to discover.

Bootstrap is not the model to follow for Kanosis accessibility ownership. Its own documentation says
authors may need to provide additional semantics and behavior, warns that some default palette
combinations can miss WCAG contrast, and identifies custom validation styles and tooltips as not
accessible to assistive technology. Kanosis should retain its stronger component-owned behavior.

| Suggestion for Kanosis                                                                                                                 | Type       | Priority | Decision                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| Publish one responsive contract for viewport ranges, containers, columns, and gutters; replace unexplained component-local breakpoints | Foundation | P0       | Adopt the consistency, using shared TypeScript/custom-media metadata because CSS variables cannot drive media queries |
| Add responsive recipes for shell, settings form, dashboard, dense table, list-detail, and mobile action layouts                        | Pattern    | P1       | Adopt examples without adding a global class framework                                                                |
| Let `ds-grid`, `ds-stack`, `ds-inline`, and `ds-container` express a small reviewed set of responsive variants                         | Component  | P1       | Adapt; prefer semantic properties or container-query behavior over hundreds of utility classes                        |
| Document supported global and component-level customization, including tokens, slots, parts, and safe examples                         | Change     | P1       | Adopt Bootstrap's discoverability while preserving Kanosis encapsulation                                              |
| Add input-group-like composition only when a product needs prefixes, suffixes, or attached actions beyond current slots                | Component  | P2       | Validate first; do not add it solely for parity                                                                       |

Official references: [grid system](https://getbootstrap.com/docs/5.3/layout/grid/),
[utility API](https://getbootstrap.com/docs/5.3/utilities/api/),
[CSS variables](https://getbootstrap.com/docs/5.3/customize/css-variables/),
[color modes](https://getbootstrap.com/docs/5.3/customize/color-modes/), and
[accessibility limitations](https://getbootstrap.com/docs/5.3/getting-started/accessibility/), including
[validation limitations](https://getbootstrap.com/docs/5.3/forms/validation/).

### Material Design 3

Material is better at making foundations feel like a coherent design language instead of a list of
values. It defines consistent component states, gives states more than one visual indicator, and
connects color, shape, type, and motion roles. Its canonical adaptive layouts—feed, list-detail, and
supporting pane—show how a page changes across compact, medium, and expanded widths. Component pages
separate overview, specification, usage, and accessibility guidance and link design-kit and platform
availability.

Material 3 Expressive also shows the value of semantic motion and deliberate action hierarchy, but
its decorative shape and emotion-led direction is not automatically appropriate for finance and
master-data applications. Platform availability varies; for example, Material documents some new
components before a Web implementation is available. Kanosis should borrow design logic, not assume
Material Web parity.

| Suggestion for Kanosis                                                                                                                             | Type       | Priority | Decision                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------- |
| Define shared enabled, hover, focus, pressed, selected, dragged, loading, and disabled state contracts with at least two cues for important states | Foundation | P0       | Adopt; audit existing elements against one state matrix                               |
| Specify compact, medium, and expanded behavior for feed, list-detail, and supporting-pane layouts                                                  | Pattern    | P1       | Adapt to `ds-pane-group`, `ds-pane`, and `ds-inspector-pane`                          |
| Replace duration-only motion guidance with semantic tokens such as control feedback, popup enter/exit, pane transition, and data update            | Foundation | P1       | Adopt intent-based naming; always map reduced motion                                  |
| Add a segmented control and an overflow-aware action bar; consider a split button only for a proven primary-action-plus-menu case                  | Component  | P1       | Adapt Material action hierarchy without its visual treatment                          |
| Add anatomy, variants, behavior, content, accessibility, responsive rules, and design/code availability to each component page                     | Change     | P0       | Adopt the documentation model                                                         |
| Explore generated brand color roles and expressive shape only if Kanosis becomes multi-brand                                                       | Foundation | P2       | Validate first; current semantic light/dark roles are sufficient for present products |

Official references: [Material Design 3](https://m3.material.io/),
[interaction states](https://m3.material.io/foundations/interaction/states/overview),
[canonical adaptive layouts](https://m3.material.io/foundations/layout/canonical-examples/overview),
[color roles](https://m3.material.io/styles/color/system/overview), and
[motion](https://m3.material.io/styles/motion/overview).

### GitHub Primer

Primer is the closest benchmark for Kanosis's dense web applications. It is better at documenting
when and why to use a component, responsive behavior, content, and concrete accessibility
expectations. Its DataTable guidance covers titles, row identity, sorting, pagination, asynchronous
announcements, horizontal-scroll focus, zoom, text spacing, target sizes, and repeated action names.

Primer also distinguishes experimental, ready, and deprecated components and describes an on-ramp
from product-specific UI to a shared component. Its task patterns cover forms, loading, navigation,
notifications, progressive disclosure, and saving. This prevents a component catalog from being
mistaken for complete product guidance.

| Suggestion for Kanosis                                                                                                                                                                       | Type       | Priority | Decision                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------ |
| Assign every component an experimental, beta/ready, or deprecated status backed by explicit exit criteria                                                                                    | Change     | P0       | Adopt before calling all 118 elements production-ready             |
| Harden `ds-data-table` and `ds-data-grid` for accessible names, row identity, repeated actions, busy/sort/page announcements, focusable overflow, numeric comparison, zoom, and text spacing | Component  | P0       | Adopt Primer's detailed acceptance model                           |
| Add forced-colors, contrast preference, 200% text size, 400% zoom/reflow, text-spacing, and RTL matrices to foundation guidance and CI                                                       | Foundation | P0       | Adopt; begin with controls, navigation, overlays, and data display |
| Publish saving, form, loading, navigation, notification, and progressive-disclosure patterns                                                                                                 | Pattern    | P1       | Adopt and tailor to Finance-Inzicht and Ontarchon workflows        |
| Require a real cross-product use case and accessibility review before promoting a product primitive into core                                                                                | Change     | P0       | Adopt the upstreaming principle                                    |
| Publish complete component guidance with do/don't examples and built-in versus consumer-owned accessibility responsibilities                                                                 | Change     | P0       | Adopt; current catalog links are not enough                        |

Official references: [foundations](https://primer.style/product/getting-started/foundations/),
[component status](https://primer.style/product/getting-started/component-status/),
[adding components](https://primer.style/product/contribute/adding-new-components/),
[UI patterns](https://primer.style/product/ui-patterns/), and
[DataTable accessibility](https://primer.style/product/components/data-table/accessibility/).

### Atlassian Design System

Atlassian is better at operationalizing tokens. Its guidance connects design libraries, runtime
themes, token descriptions, code use, lint rules, and deprecation warnings. It also models elevation
and motion by intent, not only by numeric scale.

Atlassian's content guidance is especially useful for enterprise software. It distinguishes banners,
flags, section messages, and empty states by scope and urgency, then explains how to write each. Its
drag-and-drop guidance covers pointer affordance, drop feedback, keyboard-accessible alternatives,
live-region announcements, and focus restoration—an important model for future tree, board, column,
and ordering workflows.

| Suggestion for Kanosis                                                                                                                 | Type       | Priority | Decision                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------- |
| Generate CSS and TypeScript token outputs from one source and fail CI on unknown, mismatched, raw, or deprecated foundation values     | Foundation | P0       | Adopt; this directly prevents the drift found in the audit                          |
| Define messaging by scope, urgency, persistence, action, and live-region policy; include writing rules                                 | Pattern    | P0       | Adopt across alert, banner, toast, maintenance notice, empty, and validation states |
| Introduce semantic elevation and motion roles such as raised, overlay, overflow, popup enter, and pane exit                            | Foundation | P1       | Adapt to the simpler Kanosis visual language                                        |
| Build reusable live-region, focus-restoration, and focus-containment utilities used by overlays, commands, data updates, and drag/drop | Component  | P1       | Adopt as internal primitives with public guidance where useful                      |
| Define an accessible reorder/drag pattern for trees, columns, lists, and boards, always with visible controls or menu alternatives     | Pattern    | P1       | Adopt before shipping drag behavior; do not make pointer dragging the only path     |
| Add token/component deprecation warnings and a migration-note template                                                                 | Change     | P1       | Adopt; add codemods only when a repetitive breaking migration appears               |
| Add illustration and brand-asset foundations                                                                                           | Foundation | P2       | Do only if repeated product needs justify shared ownership                          |

Official references: [foundations](https://atlassian.design/foundations),
[using tokens in code](https://atlassian.design/foundations/tokens/use-tokens-in-code/),
[motion](https://atlassian.design/foundations/motion),
[accessibility](https://atlassian.design/foundations/accessibility),
[message design](https://atlassian.design/foundations/content/designing-messages/), and
[accessible drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/).

## Prioritized Kanosis change plan

The order below deliberately hardens what exists before introducing new public APIs.

### P0 — confidence before breadth

| ID   | Type       | Change                                                                                  | Inspired by                 | Completion signal                                                                                                                                                   |
| ---- | ---------- | --------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-1 | Foundation | Create one machine-readable token source that generates `tokens.css` and typed metadata | Atlassian                   | Generated outputs agree; CI detects unknown, missing, mismatched, and deprecated tokens                                                                             |
| P0-2 | Change     | Add component maturity and ownership metadata                                           | Primer                      | All 118 elements show status, owner, adoption evidence, accessibility review, and stability expectations in the catalog                                             |
| P0-3 | Change     | Introduce a complete component-document template and state coverage manifest            | Material, Primer            | Every ready component documents anatomy, when to use, variants, state matrix, events, slots/parts, responsive behavior, accessibility, content, and migration notes |
| P0-4 | Foundation | Consolidate responsive ranges and user-preference requirements                          | Bootstrap, Material, Primer | No unexplained breakpoint duplication; forced colors, contrast, zoom, text sizing/spacing, and RTL have documented and tested expectations                          |
| P0-5 | Component  | Harden data table/data grid behavior                                                    | Primer                      | Table acceptance tests cover labels, rows, sorting, paging, loading announcements, repeated actions, keyboard overflow, numeric data, and reflow                    |
| P0-6 | Pattern    | Publish a messaging and async-feedback taxonomy                                         | Atlassian, Primer           | A decision table selects inline error, validation summary, alert, banner, toast, empty, loading, and progress behavior including content and live-region rules      |
| P0-7 | Change     | Add per-component accessibility and visual regression matrices                          | Primer                      | Ready status requires representative keyboard, axe, light/dark, narrow/wide, zoom, and preference-mode evidence rather than only tag presence                       |

### P1 — deeper product guidance

| ID   | Type       | Change                                                                                               | Inspired by         | Completion signal                                                                                                      |
| ---- | ---------- | ---------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| P1-1 | Foundation | Add semantic state, elevation, and motion roles                                                      | Material, Atlassian | Components choose tokens by intent; reduced-motion mappings and overlay stacking rules are explicit                    |
| P1-2 | Pattern    | Publish explicit/automatic saving, validation, destructive-action, undo, and unsaved-change guidance | Primer              | Settings and administration flows use one reviewed saving model and preserve user input on failure                     |
| P1-3 | Pattern    | Publish compact/medium/expanded feed, list-detail, and supporting-pane recipes                       | Material            | Each recipe has Penpot, Storybook, keyboard order, scroll ownership, and responsive behavior                           |
| P1-4 | Component  | Add segmented control and overflow-aware action bar; validate split button                           | Material, Primer    | Real product compositions prove keyboard behavior, action priority, overflow, localization, and narrow-screen behavior |
| P1-5 | Component  | Create shared focus and announcement utilities                                                       | Atlassian, Primer   | Dialogs, command palette, menus, toasts, async tables, and future drag/drop share tested focus/live-region behavior    |
| P1-6 | Pattern    | Specify accessible reordering and drag/drop                                                          | Atlassian           | Pointer, keyboard/menu alternative, outcome announcement, drop feedback, and focus restoration are all demonstrated    |
| P1-7 | Change     | Add deprecation policy, warnings, and migration notes                                                | Atlassian, Primer   | Deprecated APIs identify replacement, removal target, warning mechanism, and consumer migration path                   |
| P1-8 | Pattern    | Add responsive composition recipes and a customization cookbook                                      | Bootstrap           | Consumers can build common product pages without private breakpoints or unsupported Shadow DOM selectors               |

### P2 — only with validated demand

| ID   | Type       | Change                                                         | Inspired by         | Validation required                                                                  |
| ---- | ---------- | -------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| P2-1 | Foundation | Generated multi-brand color schemes and expressive shape roles | Material            | At least two brands with incompatible theme needs                                    |
| P2-2 | Component  | Input groups, chips, split buttons, or other parity additions  | Bootstrap, Material | Repeated product use that existing slots/composition cannot serve accessibly         |
| P2-3 | Foundation | Shared illustration and brand-asset system                     | Atlassian           | Repeated cross-product illustration ownership and governance need                    |
| P2-4 | Change     | Design-tool-to-code token synchronization automation           | Atlassian, Material | Stable Penpot library ownership and enough token-change volume to justify automation |

## Recommended quality contract

A component should be **ready** only when it has all of the following:

1. A stable use case in at least one product and evidence that it belongs in the shared system.
2. Public API, state, content, responsive, accessibility, and customization documentation.
3. Keyboard and focus tests for every interaction path, not only a representative event.
4. Automated accessibility checks for every materially different semantic state.
5. Light, dark, forced-colors, increased contrast, reduced-motion, zoom/reflow, and RTL review where
   applicable.
6. Narrow, regular, and wide examples with long localized content and empty, loading, error, disabled,
   and high-volume data where applicable.
7. Vanilla, React, and Angular contract verification without framework-specific visual forks.
8. Bundle-budget participation, status metadata, owner, changelog entry, and migration notes for
   breaking changes.

Experimental components may ship without every item, but their status and missing guarantees must
be visible. Deprecated components must identify a replacement and removal plan.

## What not to copy

- Do not reproduce Bootstrap's global utility surface; it would weaken component encapsulation and
  semantic layout ownership.
- Do not adopt Material's visual language wholesale; Kanosis serves information-dense finance and
  master-data products with its own tone.
- Do not equate any system's large catalog with automatic accessibility. Official Bootstrap and
  Atlassian pages both identify cases where consumers still own critical behavior.
- Do not create a drag-and-drop component without an equivalent non-drag path.
- Do not add components solely to improve a parity score. The next measurable improvement should be
  stronger maturity evidence and better task guidance.

## Review cadence

Revisit this benchmark every six months or before a major Kanosis release. At each review:

1. Re-run `npm run components:list` and reconcile catalog status.
2. Re-check official source-system guidance and date the snapshot.
3. Measure how many Kanosis components are experimental, ready, and deprecated.
4. Report P0 completion separately for foundations, components, patterns, and system changes.
5. Remove proposed parity work that still lacks a product use case.
