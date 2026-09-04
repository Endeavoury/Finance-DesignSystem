# Data table and data grid

`ds-data-table` is the stable tabular-data primitive. `ds-data-grid` is its experimental enterprise
alias while editable-grid requirements are validated. Use a table when people compare structured
values across rows and columns; use a list for single-axis content and a chart for trends.

## Anatomy and content

The component contains a caption or accessible label, optional description, sticky column headers,
row-header cells, data cells, an overflow frame, optional loading veil, live status, and optional
pagination. Column labels are short nouns. A `rowHeader` column must uniquely identify each row.
Repeated actions supplied by consumers need row-specific accessible names such as “Delete Cash
account,” even when the visible label is only “Delete.” Numeric columns set `numeric` and should use
an `Intl.NumberFormat` formatter owned by the product locale.

## Public contract

| Name | Kind | Type/default | Purpose |
| --- | --- | --- | --- |
| `columns` | Property | `DsTableColumn[]` | Labels, sortability, row identity, numeric alignment, width, and formatting |
| `rows` | Property | `Record<string, unknown>[]` | Current client-side rows or current server page |
| `caption` / `label` | Property | string | Visible caption or fallback accessible name |
| `description` | Property | string | Visible and programmatic table context |
| `rowKey` / `selectedKey` | Property | `id` / string | Stable row identity and selected row |
| `selectable` / `busy` | Property | false | Enable row activation or async loading state |
| `focusableOverflow` | Property | true | Lets keyboard users reach and scroll a clipped table |
| `sortKey` / `sortDirection` | Property | string / ascending | Controlled sort state |
| `page` / `pageSize` / `totalRows` | Property | 1 / 0 / 0 | Client or server pagination contract |
| `ds-sort` | Event | `{ key, direction }` | Requests sorted data and announces the change |
| `ds-row-select` | Event | `{ row, index, key }` | Reports keyboard or pointer row activation |
| `ds-page-change` | Event | `{ page }` | Requests a page and announces the destination |
| `frame` / `table` | CSS part | — | Supported surface customization points |

## State and interaction matrix

| State | Visual and semantic behavior | Input |
| --- | --- | --- |
| Default | Caption/label, headers, row headers, formatted cells | Read and horizontal-scroll |
| Sortable | Header button and direction indicator; live announcement | Click or activate header button |
| Selectable | Hover/focus/selected cues and stable key | Click, Enter, or Space on a row |
| Loading | `aria-busy`, delayed polite “Loading” message, visual veil | Existing content remains contextual |
| Empty | One full-width empty message | Consumer provides a useful recovery cue |
| Paged | Previous/next controls and page status | Buttons emit `ds-page-change` |
| Overflow | Focus-visible scroll frame | Tab, then browser horizontal-scroll keys |

## Responsive, preferences, and accessibility ownership

The table keeps tabular relationships at compact widths and gives scroll ownership to its labeled
frame. It is regression-tested at 200% page zoom, compact width, light/dark, increased contrast,
forced colors, text spacing, and RTL. Row identity, meaningful caption/description, localized
formatters, unique repeated-action names, and server request error handling remain consumer-owned.
The component owns table semantics, header scopes, sort state, focus-visible overflow, numeric
alignment, target sizes, busy/sort/page announcements, and reduced-motion styling.

Avoid disabling overflow focus when content can clip. At 400% browser zoom the same compact reflow
contract applies; do not put the table in a second horizontal scrolling container.

## Availability and evidence

- Storybook: `Components/Data/Data Table`, including compact, empty/loading, and overflow examples.
- Behavior and accessibility: `tests/components.test.ts` and `tests/accessibility.test.ts`.
- Visual matrix: `tests/visual-regression.spec.ts`.
- Vanilla: `@endeavoury/kanosis/data-table`; React: `DataTable`; Angular: registered custom element.
- Migration: no deprecated table APIs. Treat `ds-data-grid` as experimental until editable-grid
  keyboard and selection models are specified.
