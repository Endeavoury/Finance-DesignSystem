# Component Gap Analysis and Roadmap

## Delivery status

The August 2026 cross-product design-system review completed the workflow-focused P1 increment and a broader Material/Bootstrap capability pass. The system now includes 58 registered elements spanning actions, forms, navigation, overlays, feedback, data display, application structure, and layout. Every delivered element has Web Component registration, React adapters, Storybook coverage, and automated quality gates.

## Gap analysis

| Current UI pattern             |                       Usage | Proposed component/pattern                                                 | Priority  | Notes                                                     |
| ------------------------------ | --------------------------: | -------------------------------------------------------------------------- | --------- | --------------------------------------------------------- |
| Primary/secondary/text actions |                   Very high | `ds-button`, `ds-icon-button`, `ds-button-group`                           | P0        | Loading, disabled, destructive, compact                   |
| Labeled fields and validation  |                   Very high | `ds-form-field`, `ds-input`, `ds-select`, `ds-checkbox`, `ds-search-input` | P0        | Form-associated controls                                  |
| KPI cards and summaries        |                   Very high | `ds-metric`, `ds-kpi-grid`                                                 | P0        | Currency/value-agnostic slots                             |
| Content surfaces               |                   Very high | `ds-card`, `ds-panel`                                                      | P0        | Stable header/footer parts and slots                      |
| Dense result tables            |                   Very high | `ds-data-table`                                                            | P0        | Property-based rows/columns, sort/select events, overflow |
| Status/category labels         |                        High | `ds-badge`, `ds-status-badge`                                              | P0        | Semantic tones, not domain statuses                       |
| App navigation                 |                        High | `ds-app-shell`, `ds-sidebar`, `ds-sidebar-item`                            | P0        | Responsive desktop/mobile composition                     |
| Page title/actions             |                        High | `ds-page-header`                                                           | P0        | Eyebrow, description, action slot                         |
| Filter forms/toolbars          |                        High | `ds-filter-bar`                                                            | P0        | Composition, responsive collapse                          |
| Feedback and no-data states    |                        High | `ds-alert`, `ds-loading-state`, `ds-empty-state`                           | P0        | Live-region behavior where appropriate                    |
| User/profile identity          |                      Medium | `ds-avatar`                                                                | P0        | Initials/image/fallback                                   |
| Layout composition             |                        High | `ds-stack`, `ds-inline`, `ds-grid`, `ds-container`                         | P0        | Attribute-driven, no utility leakage                      |
| Period/category selection      |                      Medium | `ds-tabs`                                                                  | Delivered | Roving tabindex and keyboard arrows                       |
| Expandable detail              |                      Medium | `ds-disclosure`                                                            | Delivered | Native details semantics                                  |
| File import                    |                      Medium | `ds-drop-zone`                                                             | Delivered | Native file input, drag state, validation events          |
| Property detail groups         |                      Medium | `ds-description-list`, `ds-key-value`                                      | P1        | Raw transaction/account detail                            |
| Progress indicators            |                      Medium | `ds-progress`, `ds-skeleton`                                               | Delivered | Determinate/indeterminate/reduced motion                  |
| Temporary messages             |                   Low today | `ds-toast`, `ds-toast-region`                                              | Delivered | Timed/persistent behavior and live-region policy          |
| Confirmation/modal detail      |             Not present yet | `ds-dialog`, `ds-drawer`                                                   | Delivered | Native dialog/top layer, focus return, dismissal reasons  |
| Menus                          |        Mobile overflow only | `ds-menu`, `ds-menu-item`                                                  | Delivered | Roving focus and typed selection                          |
| Pagination                     | API supports it, UI minimal | `ds-pagination`                                                            | Delivered | Ellipsis and controlled page events                       |
| Tooltips                       |                         Low | `ds-tooltip`                                                               | Delivered | Supplemental only, never sole label                       |
| Radio/switch/textarea/range    |           Low in current UI | `ds-radio-group`, `ds-radio`, `ds-switch`, `ds-textarea`, `ds-range`       | Delivered | Form-associated generic controls                          |
| Breadcrumbs and lists          |                 Not present | `ds-breadcrumbs`, `ds-breadcrumb`, `ds-list`, `ds-list-item`               | Delivered | Hierarchy and flexible collections                        |
| Hierarchical system navigation |              Ontarchon high | `ds-tree`, `ds-tree-item`                                                   | Delivered | Expandable, keyboard-operable Node navigation             |
| Structured semantic metadata   |              Ontarchon high | `ds-description-list`, `ds-code-block`                                      | Delivered | URI/schema properties and readable technical artefacts    |
| Light/dark preference          |                        High | `ds-theme-toggle`                                                          | Delivered | Persistent document theme with typed change event         |

## Delivery roadmap

### P0 — Current core workflows

Foundations, layouts, actions, current form controls, badges/avatar, surfaces/metrics, feedback states, data table, application shell/navigation, page header, filter bar, and KPI grid. P0 includes Storybook dashboard, monthly overview, ledger, and settings/import compositions.

### P1 — Important secondary workflows (delivered)

Tabs, disclosure, drop zone, progress/skeleton, toast, dialog/drawer, menu, pagination, breadcrumbs, and lists. Description lists remain composable from existing layout and typography primitives until a product screen requires a dedicated API.

### P2 — Generic expansion (partially delivered)

Tooltip, textarea, radio group, switch, range, and breadcrumbs are delivered. The next meaningful additions are autocomplete/combobox, date/time input patterns, segmented controls, richer data-grid behavior, and formal RTL/high-contrast validation.
