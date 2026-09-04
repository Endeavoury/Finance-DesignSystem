# External design-system review implementation report

This report maps every recommendation in the Bootstrap, Material, Primer, and Atlassian review to a
delivered artifact. The component status manifest remains intentionally conservative: new APIs and
catalog-only components stay experimental until their evidence is complete.

| ID | Priority/type | Delivered implementation |
| --- | --- | --- |
| P0-1 | P0 foundation | `tokens.css` is the machine-readable release source; typed metadata and package CSS are generated/verified. CI rejects drift, unknown token references, raw colors, and raw motion values. |
| P0-2 | P0 change | `component-status.json` covers all 118 elements with owner, adoption evidence, stability, documentation, state coverage, and accessibility/behavior/visual review state. |
| P0-3 | P0 change | The complete documentation template and generated readiness/state manifest gate every ready component. The hardened table has a full guide; incomplete components are classified experimental. |
| P0-4 | P0 foundation | Shared compact/medium/expanded/wide ranges replaced private breakpoints. Theme guidance and tests cover contrast, forced colors, zoom/reflow, text spacing, reduced motion, and RTL. |
| P0-5 | P0 component | Data table/grid now cover accessible names and descriptions, row identity, unique-action guidance, busy/sort/page announcements, focusable overflow, numeric comparison, pagination, zoom, and text spacing. |
| P0-6 | P0 pattern | Messaging guidance selects validation, summary, alert, banner, toast, empty, loading, and progress by scope, urgency, persistence, action, and live-region policy. |
| P0-7 | P0 change | Axe compositions, behavior tests, Storybook globals, and Playwright screenshots provide keyboard/semantic and light/dark/narrow/wide/preference evidence; manifest promotion consumes that evidence. |
| P1-1 | P1 foundation | Semantic state, raised/overlay/overflow elevation, popup/pane/update motion, reduced-motion, and stacking roles are tokenized. |
| P1-2 | P1 pattern | Saving/forms guidance covers explicit and automatic saving, validation, destructive confirmation, undo, failures, and unsaved changes. |
| P1-3 | P1 pattern | Feed, list-detail, and supporting-pane recipes document range behavior, focus/DOM order, and scroll ownership and have Storybook fixtures. |
| P1-4 | P1 component | Segmented control, automatically overflowing action bar, and validated split button ship with keyboard, localization, and compact behavior. |
| P1-5 | P1 component | Shared live-region, focus capture/restoration, and focusable-element utilities support tables, reordering, and overlays. |
| P1-6 | P1 pattern | Reordering ships pointer drag plus visible keyboard buttons, drop feedback, announcements, focus restoration, tests, and guidance. |
| P1-7 | P1 change | Deprecation policy, runtime warning helper, token aliases, removal targets, and migration-note template are in place. |
| P1-8 | P1 pattern | Responsive recipes and the customization cookbook cover containers, grid/inline collapse, action overflow, panes, tokens, slots, and CSS parts. |
| P2-1 | P2 foundation | Default, Finance, and Ontology generated brand schemes plus semantic component/surface/overlay shape roles demonstrate validated multi-brand demand. |
| P2-2 | P2 component | Input group, chip, and split-button APIs are implemented as framework-neutral Web Components with React adapters and Angular registration. |
| P2-3 | P2 foundation | Governed brand mark and semantic illustration components use theme tokens, accessible labeling, and repo-native SVG assets. |
| P2-4 | P2 change | A reviewable Penpot token import command validates selectors/names, rejects deprecated tokens, updates runtime source deterministically, and regenerates typed metadata. |

Run `npm run check` for the complete acceptance gate. See the individual foundation, pattern,
component, maturity, deprecation, brand, and Penpot documents linked from the root README.
