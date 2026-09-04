# @endeavoury/kanosis

Product-neutral Lit Web Components for Kanosis. Import the package root to register all elements, a grouped entry point such as `/button`, `/forms`, `/interaction`, `/overlays`, `/navigation`, `/tree`, or `/enterprise` for selective registration, and `/styles.css` for the optional global foundation.

The first enterprise workflow release is the P0 data-management set: `ds-data-grid`, `ds-filter-builder`, `ds-view-toolbar`, `ds-column-manager`, `ds-bulk-actions`, `ds-saved-view`, `ds-combobox`, and `ds-validation-summary`.

The P1 productivity set adds `ds-command-palette`, `ds-global-search`, `ds-tenant-switcher`, `ds-user-menu`, `ds-workspace-tabs`, `ds-navigation-group`, `ds-context-menu`, `ds-quick-actions`, `ds-record-header`, `ds-detail-list`, `ds-notification-center`, and `ds-banner`.

The P2 operations set adds `ds-form-section`, `ds-field-array`, `ds-date-picker`, `ds-time-picker`, `ds-file-upload`, `ds-stepper`, `ds-approval-flow`, `ds-task-list`, `ds-timeline`, `ds-activity-feed`, `ds-job-status`, and `ds-change-summary`.

The P3 governance set adds `ds-audit-log`, `ds-permission-matrix`, `ds-role-badge`, `ds-diff-viewer`, `ds-code-editor`, `ds-json-editor`, `ds-maintenance-notice`, `ds-help-panel`, `ds-tour`, `ds-coachmark`, and `ds-compare-view`.

## Fixed application layouts

`ds-app-shell` owns the viewport and keeps its `sidebar` and optional `header` outside the main scroll area. Its default content is independently scrollable. Use `content-mode="pane"` when composing a nested workspace from `ds-pane-group`, `ds-pane`, `ds-pane-header`, `ds-pane-content`, `ds-scrollable-pane`, and `ds-inspector-pane`.

```html
<ds-app-shell content-mode="pane">
  <ds-sidebar slot="sidebar">...</ds-sidebar>
  <div slot="header">...</div>
  <ds-pane-group>
    <ds-pane position="center">
      <ds-pane-header>...</ds-pane-header>
      <ds-pane-content scrollable>...</ds-pane-content>
    </ds-pane>
  </ds-pane-group>
  <ds-inspector-pane slot="inspector">...</ds-inspector-pane>
</ds-app-shell>
```

Nest a vertical `ds-pane-group orientation="vertical"` inside a horizontal group to combine top/bottom panes with left/center/right panes. Set `sidebar-collapsed` on the shell and `collapsed` on side panes to remove them from the desktop layout. Below 800px inspector panes become overlay drawers; below 680px the primary sidebar becomes a bottom navigation pane. The global stylesheet locks document scrolling only while a `ds-app-shell` is present (or when `.ds-application` is applied explicitly).

## Component authoring

Use the component-first TypeScript layout in [`docs/development.md`](../../docs/development.md). The [`component catalog`](../../docs/component-catalog.md) indexes Storybook autodocs and documentation coverage for every registered element. `node scripts/scaffold-component.mjs <name>` creates the colocated TypeScript implementation, SCSS source, HTML fixture, registration, Storybook, and docs starting points.
