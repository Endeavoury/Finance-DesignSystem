# Responsive composition and customization cookbook

## Product recipes

- **Application shell:** persistent navigation at expanded/wide, simplified destination switcher at
  medium, and bottom or drawer navigation at compact.
- **Settings form:** one readable column, grouped by `ds-form-section`; action bar follows the active
  form rather than floating far from it.
- **Dashboard:** KPI grid first, then analytics panels; reduce columns before reducing legibility.
- **Dense table:** retain semantic columns, focusable horizontal overflow, optional lower-priority
  column removal, and paging for large data.
- **Mobile actions:** keep the primary action visible; move reviewed secondary actions to the
  `ds-action-bar` overflow slot.

## Customization order

1. Choose theme, contrast, and brand attributes at the application or subtree boundary.
2. Override documented semantic tokens for theme-level changes.
3. Use component properties and slots for behavior and content.
4. Use documented `::part()` hooks for a local visual adjustment.
5. Request a shared API when repeated changes require private Shadow DOM selectors.

Do not reproduce a global utility framework. `ds-stack`, `ds-inline`, `ds-grid`, `ds-container`,
`ds-pane-*`, and `ds-action-bar` form the supported composition vocabulary.
