# Adaptive application layouts

These canonical recipes use existing pane components and the shared responsive ranges.

## Feed

Use `ds-container` and responsive `ds-grid` for cards, metrics, or search results. Compact displays one
column, medium typically two, and expanded/wide may use three or four when content remains readable.
DOM and keyboard order follow reading order at every width.

## List-detail

Compose `ds-pane-group` with a left `ds-pane` for the list and a center pane for detail. At compact and
medium widths, show one region at a time and provide a named Back action. Retain list scroll position,
selection, and focus when returning. Do not merely squeeze both panes below a usable width.

## Supporting pane

Use a center `ds-pane` plus `ds-inspector-pane` for contextual detail, properties, filters, or help.
The inspector becomes an overlay below the expanded range. Opening moves focus to its heading or first
task; closing returns focus to the trigger. The primary pane owns document scroll unless a contained
workspace explicitly assigns scroll to `ds-pane-content`.

## Three-region workspace

Wide layouts may add left navigation, a central work area, and a right inspector. Never require the
third pane for task completion; medium layouts expose it through an explicit action. Each scrollable
region needs a visible label and a predictable keyboard path.

Storybook's adaptive-layout stories are the executable reference for compact, medium, expanded, long
content, and RTL review.
