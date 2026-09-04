# Action, input, asset, and reordering additions

These experimental components close recurring composition gaps while product validation continues.
Their Storybook examples are the canonical do/don't and responsive demonstrations.

| Component | Use | Main contract and state | Consumer responsibility |
| --- | --- | --- | --- |
| `ds-segmented-control` + `ds-segment` | One selection among a small peer set | `value`, `label`, `ds-change`; radio semantics, selected/disabled, arrows, Home, End | Keep labels short; use tabs when selection changes navigation context |
| `ds-action-bar` | Prioritized page or record actions | `label`, `collapse-at-compact`; automatic overflow plus `data-priority="primary"` and `data-overflow` hints | Put one primary action first; localize and test labels at narrow widths |
| `ds-split-button` | Frequent default action with related alternatives | `label`, `menu-label`, `open`, `disabled`, `ds-activate`, `ds-menu-toggle`, `menu` slot | Alternatives must be valid menu items; avoid for unrelated actions |
| `ds-input-group` | One input with meaningful prefix/suffix context | `label`, default/prefix/suffix slots | Keep the nested field's own accessible label; do not use decoration as its label |
| `ds-chip` | Compact selectable or dismissible value | `value`, `label`, `selected`, `dismissible`, `disabled`, `ds-change`, `ds-dismiss` | Explain destructive removal when dismissal has wider effects |
| `ds-live-region` | Declarative async announcement | `message`, `politeness` | Announce outcomes, not every intermediate render; prefer polite unless urgent |
| `ds-reorder-list` + `ds-reorder-item` | Reorder a short list | `value`, `label`, `ds-reorder`; drag, visible move buttons, live outcome, focus restoration | Persist the returned order, report failure, and retain the user's focus |
| `ds-illustration` | Shared empty/search/success/error visual | `variant`, `label` | Omit `label` when decorative; do not convey status only through artwork |
| `ds-brand-mark` | Approved product/system identifier | `name`, `symbolOnly` | Use the named asset; don't redraw or recolor internal SVG paths |

All controls use semantic shape, motion, elevation, focus, target-size, contrast, forced-color, and
reduced-motion foundations. Logical properties support RTL. The visual matrix exercises compact and
expanded layouts, light/dark, brand themes, increased and forced colors, RTL, and text spacing.

Promotion to ready requires a stable use case, separate state examples, API review, adapter checks,
and the full maturity checklist. Until then, breaking changes are allowed and the manifest reports
the components as experimental.
