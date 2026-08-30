# Component breadth benchmark

All adapters expose the same custom-element implementation. Ontarchon Studio
and Nexus consume the vanilla custom-element contract directly from Angular;
Finance-Inzicht does the same; the public website consumes the generated browser
bundle. React wrappers map the same properties and composed events without
forking markup or styles.

## Benchmark and scope

This catalog is benchmarked against the application-facing component families in [Material Design 3](https://m3.material.io/components) and [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/components/). The objective is comparable product-building capability, not one-to-one naming or cloning either system's visual language.

Finance Design deliberately keeps one semantic, accessible Web Component API instead of combining a CSS utility framework with a separate JavaScript plugin layer. Every component uses the same tokens, light/dark behavior, event naming, registration model, and framework adapters.

## Coverage matrix

| Product capability     | Finance Design                                                                            | Material / Bootstrap analogue                             | Status                      |
| ---------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------- |
| Actions                | `ds-button`, `ds-icon-button`, `ds-button-group`                                          | Buttons, icon buttons, FAB, button groups                 | Covered                     |
| Text entry             | `ds-input`, `ds-search-input`, `ds-textarea`                                              | Text fields, search, form controls                        | Covered                     |
| Choice controls        | `ds-select`, `ds-checkbox`, `ds-switch`, `ds-radio-group`, `ds-radio`, `ds-range`         | Select, checkbox, switch, radio, slider/range             | Covered                     |
| Form composition       | `ds-form-field`, validation APIs, native form association                                 | Form field, input group, validation, layout               | Covered through composition |
| Navigation             | `ds-sidebar`, `ds-sidebar-item`, `ds-tabs`, `ds-breadcrumbs`, `ds-pagination`             | Navigation rail/drawer, tabs, breadcrumb, pagination      | Covered                     |
| Menus and lists        | `ds-menu`, `ds-menu-item`, `ds-list`, `ds-list-item`                                      | Menus/dropdowns and lists/list groups                     | Covered                     |
| Surfaces and summaries | `ds-card`, `ds-panel`, `ds-metric`, `ds-kpi-grid`                                         | Cards and elevated/outlined containers                    | Covered                     |
| Status and identity    | `ds-badge`, `ds-status-badge`, `ds-avatar`                                                | Badges/chips and avatars                                  | Covered                     |
| Feedback               | `ds-alert`, `ds-toast`, `ds-toast-region`, `ds-progress`, `ds-skeleton`, state components | Alerts/snackbars/toasts, progress, placeholders, spinners | Covered                     |
| Expand/collapse        | `ds-disclosure`                                                                           | Accordion/collapse                                        | Covered                     |
| Overlays               | `ds-dialog`, `ds-drawer`                                                                  | Dialog/modal and drawer/offcanvas                         | Covered                     |
| Supplemental help      | `ds-tooltip`                                                                              | Tooltip                                                   | Covered                     |
| File input             | `ds-drop-zone`                                                                            | File input plus application drop behavior                 | Covered                     |
| Data display           | `ds-data-table`, `ds-list`, layout primitives                                             | Tables and list groups                                    | Covered                     |
| Application structure  | `ds-app-shell`, `ds-page-header`, `ds-filter-bar`, layout primitives                      | Navbar/sidebar, containers, grid, stacks                  | Covered                     |

The complete package currently registers 58 custom elements. Storybook is required to contain every registered element, so the catalog cannot silently grow without reviewable examples.

## Deliberate differences

- Carousel and scrollspy are content-site patterns, not current financial-product primitives. They remain outside the core package.
- Popovers are represented by the composable menu, tooltip, dialog, and drawer primitives. A generic unconstrained popover will only be added with a concrete accessible interaction model.
- CSS utilities are not reproduced wholesale. `ds-stack`, `ds-inline`, `ds-grid`, and `ds-container` provide stable layout contracts without leaking hundreds of global classes.
- Date/time pickers, autocomplete/combobox, and rich data-grid virtualization need dedicated internationalization and interaction work. They are the next meaningful breadth tier rather than thin visual wrappers.
- Components retain the Finance Design visual language. Material and Bootstrap are capability benchmarks, not styling dependencies.

## Catalog quality contract

New components are not considered delivered until they have:

1. semantic light and dark theme behavior;
2. keyboard and screen-reader behavior appropriate to the interaction pattern;
3. typed composed custom events;
4. full and selective registration exports;
5. React adapter coverage and native Angular compatibility;
6. Storybook examples, automated behavior tests, and representative axe coverage;
7. bundle-budget participation.

## Next breadth tier

The remaining high-value additions are autocomplete/combobox, date and time input patterns, a segmented control, a richer data-grid layer, visual-regression coverage across both themes, and formal RTL/high-contrast verification.
