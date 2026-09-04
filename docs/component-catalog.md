# Component catalog

This catalog is the documentation index for every registered custom element. Each tag is covered by
a Storybook example with autodocs. Story presence establishes discoverability; production readiness
is tracked separately in the [component status manifest](component-status.json) under the
[component maturity policy](component-maturity.md).

The [implementation report](implementation-report.md) maps the external review backlog to the
delivered foundations, components, patterns, and quality gates. Detailed guides currently cover the
[data table/grid](components/data-table.md) and
[action, input, asset, and reordering additions](components/maturity-additions.md); the status
manifest keeps catalog-only entries experimental rather than overstating their readiness.

## Layout and navigation

`ds-app-shell`, `ds-pane-group`, `ds-pane`, `ds-scrollable-pane`, `ds-sidebar`, `ds-inspector-pane`, `ds-pane-header`, `ds-pane-content`, `ds-navigation-group`, `ds-workspace-tabs` — [layout and enterprise stories](../storybook/stories/components/enterprise-p1.stories.ts)

## Data, forms, and workflows

`ds-data-grid`, `ds-data-table`, `ds-filter-builder`, `ds-filter-bar`, `ds-view-toolbar`, `ds-column-manager`, `ds-bulk-actions`, `ds-saved-view`, `ds-combobox`, `ds-validation-summary`, `ds-form-section`, `ds-field-array`, `ds-date-picker`, `ds-time-picker`, `ds-file-upload`, `ds-drop-zone`, `ds-stepper`, `ds-approval-flow`, `ds-task-list`, `ds-detail-list`, `ds-detail-sidebar`, `ds-record-header`, `ds-change-summary` — [enterprise stories](../storybook/stories/components/enterprise.stories.ts), [workflow stories](../storybook/stories/components/enterprise-p2.stories.ts)

## Search, commands, and notifications

`ds-command-palette`, `ds-global-search`, `ds-tenant-switcher`, `ds-user-menu`, `ds-context-menu`, `ds-quick-actions`, `ds-notification-center`, `ds-banner`, `ds-maintenance-notice`, `ds-help-panel`, `ds-tour`, `ds-coachmark` — [enterprise stories](../storybook/stories/components/enterprise-p1.stories.ts), [P3 stories](../storybook/stories/components/enterprise-p3.stories.ts)

## Audit, security, and developer tools

`ds-audit-log`, `ds-permission-matrix`, `ds-role-badge`, `ds-diff-viewer`, `ds-code-editor`, `ds-json-editor`, `ds-compare-view`, `ds-job-status`, `ds-timeline`, `ds-activity-feed` — [P2 stories](../storybook/stories/components/enterprise-p2.stories.ts), [P3 stories](../storybook/stories/components/enterprise-p3.stories.ts)

## Foundations and controls

`ds-alert`, `ds-avatar`, `ds-badge`, `ds-breadcrumb`, `ds-breadcrumbs`, `ds-button`, `ds-button-group`, `ds-card`, `ds-checkbox`, `ds-code-block`, `ds-container`, `ds-description-list`, `ds-dialog`, `ds-disclosure`, `ds-drawer`, `ds-empty-state`, `ds-form-field`, `ds-grid`, `ds-icon`, `ds-icon-button`, `ds-inline`, `ds-input`, `ds-kpi-grid`, `ds-list`, `ds-list-item`, `ds-loading-state`, `ds-menu`, `ds-menu-item`, `ds-metric`, `ds-page-header`, `ds-pagination`, `ds-panel`, `ds-progress`, `ds-radio`, `ds-radio-group`, `ds-range`, `ds-search-input`, `ds-select`, `ds-sidebar-item`, `ds-skeleton`, `ds-stack`, `ds-status-badge`, `ds-switch`, `ds-tab`, `ds-tabs`, `ds-textarea`, `ds-theme-toggle`, `ds-toast`, `ds-toast-region`, `ds-tooltip`, `ds-tree`, `ds-tree-item` — [component stories](../storybook/stories/components)

## Action, accessibility, asset, and reordering additions

`ds-live-region`, `ds-segmented-control`, `ds-segment`, `ds-action-bar`, `ds-split-button`,
`ds-input-group`, `ds-chip`, `ds-illustration`, `ds-brand-mark`, `ds-reorder-list`,
`ds-reorder-item` — [maturity addition stories](../storybook/stories/components/enhancements.stories.ts)

When a component gains a dedicated story family, update its link here; the tag itself must remain present so `npm run verify:components` can enforce coverage.
