import { css, html, nothing, type CSSResultGroup, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { a11yStyles, foundationStyles, spinnerStyles } from '@endeavoury/kanosis-styles';
import { DsElement, type DsDensity } from '../core/ds-element.js';

export interface DsTableColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row | string;
  label: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  numeric?: boolean;
  rowHeader?: boolean;
  width?: string;
  format?: (value: unknown, row: Row) => unknown;
}
export interface DsSortDetail {
  key: string;
  direction: 'ascending' | 'descending';
}
export interface DsRowSelectDetail<Row = Record<string, unknown>> {
  row: Row;
  index: number;
  key: string;
}

export class DsDataTable extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    a11yStyles,
    spinnerStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .frame {
        position: relative;
        max-width: 100%;
        overflow: auto;
        border: 1px solid var(--ds-color-border-default);
        border-top-color: var(--ds-color-border-highlight);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
        box-shadow: var(--ds-shadow-panel);
      }
      .frame:focus-visible {
        outline: 2px solid var(--ds-color-focus);
        outline-offset: 2px;
      }
      table {
        width: 100%;
        min-width: 38rem;
        border-collapse: collapse;
        font-size: var(--ds-font-size-md);
        font-variant-numeric: tabular-nums;
      }
      caption {
        padding: var(--ds-space-3);
        text-align: start;
        font-weight: var(--ds-font-weight-semibold);
      }
      .description {
        display: block;
        margin-top: var(--ds-space-1);
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-regular);
      }
      th,
      td {
        padding: 0.8125rem var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        text-align: start;
        vertical-align: middle;
      }
      thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--ds-color-bg-elevated) 72%, var(--ds-color-bg-surface));
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: 0.085em;
        text-transform: uppercase;
      }
      tbody th {
        font-weight: var(--ds-font-weight-medium);
      }
      tbody tr:last-child > * {
        border-bottom: 0;
      }
      tbody tr {
        transition: background var(--ds-duration-fast);
      }
      tbody tr[data-interactive] {
        cursor: pointer;
      }
      tbody tr[data-interactive]:hover,
      tbody tr[data-selected] {
        background: color-mix(in srgb, var(--ds-color-bg-selected) 72%, transparent);
      }
      tbody tr[data-selected] > :first-child {
        box-shadow: inset 2px 0 var(--ds-color-accent-primary);
      }
      tbody tr[data-interactive]:focus-visible {
        outline: 2px solid var(--ds-color-focus);
        outline-offset: -2px;
      }
      .end {
        text-align: end;
      }
      .center {
        text-align: center;
      }
      .numeric {
        text-align: end;
        font-variant-numeric: tabular-nums;
      }
      .sort {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-1);
        width: 100%;
        min-height: var(--ds-target-min);
        padding: var(--ds-space-1) 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        cursor: pointer;
      }
      .sort:disabled {
        cursor: wait;
      }
      .sort:focus-visible {
        outline-offset: 3px;
        border-radius: var(--ds-radius-sm);
      }
      .sort.end {
        justify-content: flex-end;
      }
      .sort.center {
        justify-content: center;
      }
      .indicator {
        font-size: 0.75rem;
      }
      .empty {
        padding: var(--ds-space-8);
        text-align: center;
        color: var(--ds-color-text-muted);
      }
      .busy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--ds-color-bg-surface) 82%, transparent);
        backdrop-filter: blur(2px);
      }
      .pagination {
        position: sticky;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: var(--ds-space-2);
        min-width: 100%;
        padding: var(--ds-space-2) var(--ds-space-3);
        border-top: 1px solid var(--ds-color-border-subtle);
        background: var(--ds-color-bg-surface-subtle);
      }
      .range {
        margin-inline-end: auto;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .pagination button {
        min-width: var(--ds-target-min);
        min-height: var(--ds-target-min);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-control);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-primary);
        cursor: pointer;
      }
      .pagination button:disabled {
        cursor: not-allowed;
        opacity: var(--ds-opacity-disabled);
      }
      :host([density='compact']) th,
      :host([density='compact']) td {
        padding: var(--ds-space-2) var(--ds-space-3);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property({ attribute: false }) columns: DsTableColumn[] = [];
  @property({ attribute: false }) rows: Record<string, unknown>[] = [];
  @property() caption = '';
  @property() label = 'Data table';
  @property() description = '';
  @property() emptyMessage = 'No results';
  @property() rowKey = 'id';
  @property() selectedKey = '';
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) busy = false;
  @property({ type: Boolean, attribute: 'focusable-overflow' }) focusableOverflow = true;
  @property({ attribute: 'loading-label' }) loadingLabel = 'Loading data';
  @property({ type: Number, attribute: 'announcement-delay' }) announcementDelay = 750;
  @property({ type: Number }) page = 1;
  @property({ type: Number, attribute: 'page-size' }) pageSize = 0;
  @property({ type: Number, attribute: 'total-rows' }) totalRows = 0;
  @property({ reflect: true }) density: DsDensity = 'comfortable';
  @property({ attribute: 'sort-key' }) sortKey = '';
  @property({ attribute: 'sort-direction' }) sortDirection: 'ascending' | 'descending' =
    'ascending';
  @state() private announcement = '';
  private announcementTimer?: ReturnType<typeof globalThis.setTimeout>;

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.announcementTimer) globalThis.clearTimeout(this.announcementTimer);
  }

  protected override willUpdate() {
    this.page = Math.min(this.pageCount(), Math.max(1, Math.floor(this.page) || 1));
  }

  protected override updated(changed: PropertyValues<this>) {
    if (!changed.has('busy')) return;
    if (this.announcementTimer) globalThis.clearTimeout(this.announcementTimer);
    if (!this.busy) {
      if (changed.get('busy') === true) this.announcement = `${this.label} loaded`;
      return;
    }
    this.announcement = '';
    this.announcementTimer = globalThis.setTimeout(() => {
      if (this.busy) this.announcement = this.loadingLabel;
    }, this.announcementDelay);
  }

  private announce(message: string) {
    this.announcement = '';
    globalThis.setTimeout(() => (this.announcement = message), 20);
  }
  private sort(column: DsTableColumn) {
    if (!column.sortable || this.busy) return;
    const key = String(column.key);
    this.sortDirection =
      this.sortKey === key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortKey = key;
    this.announce(`${column.label} sorted ${this.sortDirection}`);
    this.emit<DsSortDetail>('ds-sort', { key, direction: this.sortDirection });
  }
  private sortedRows() {
    const rows = this.rows.map((row, index) => ({ row, index }));
    if (!this.sortKey) return rows;
    const direction = this.sortDirection === 'ascending' ? 1 : -1;
    const key = this.sortKey;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return rows.sort((left, right) => {
      const a = left.row[key];
      const b = right.row[key];
      // Missing values stay last in either direction.
      if (a == null) return b == null ? 0 : 1;
      if (b == null) return -1;
      return (
        (typeof a === 'number' && typeof b === 'number'
          ? a - b
          : collator.compare(String(a), String(b))) * direction
      );
    });
  }
  private select(row: Record<string, unknown>, index: number) {
    if (!this.selectable || this.busy) return;
    const key = String(row[this.rowKey] ?? index);
    this.selectedKey = key;
    this.emit<DsRowSelectDetail>('ds-row-select', { row, index, key });
  }
  private rowKeydown(event: KeyboardEvent, row: Record<string, unknown>, index: number) {
    if (!this.selectable || this.busy || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(row, index);
    }
  }
  private rowClick(event: MouseEvent, row: Record<string, unknown>, index: number) {
    const path = event.composedPath();
    const interactive = path
      .slice(0, path.indexOf(event.currentTarget!))
      .some(
        (target) =>
          target instanceof Element &&
          target.matches(
            'button, a, input, select, textarea, [role="button"], [role="link"], [contenteditable], [tabindex]',
          ),
      );
    if (!event.defaultPrevented && !interactive) this.select(row, index);
  }
  private pageCount() {
    if (!(this.pageSize > 0)) return 1;
    return Math.max(1, Math.ceil((this.totalRows || this.rows.length) / this.pageSize));
  }
  private visibleRows(rows: { row: Record<string, unknown>; index: number }[]) {
    if (!(this.pageSize > 0) || this.totalRows > this.rows.length) return rows;
    const start = (Math.max(1, this.page) - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }
  private changePage(page: number) {
    if (this.busy) return;
    const next = Math.min(this.pageCount(), Math.max(1, page));
    if (next === this.page) return;
    this.page = next;
    this.announce(`${this.label}, page ${next} of ${this.pageCount()}`);
    this.emit<{ page: number }>('ds-page-change', { page: next });
  }
  protected override render() {
    const rows = this.visibleRows(this.sortedRows());
    const accessibleLabel = this.caption || this.label;
    const pageCount = this.pageCount();
    const total = this.totalRows || this.rows.length;
    const firstRow = rows.length ? (this.page - 1) * this.pageSize + 1 : 0;
    const lastRow = Math.min(total, firstRow + rows.length - 1);
    return html`<div
      class="frame"
      part="frame"
      tabindex=${this.focusableOverflow ? '0' : nothing}
      aria-label=${this.focusableOverflow ? `${accessibleLabel} scroll area` : nothing}
    >
      <table
        part="table"
        aria-label=${this.caption ? nothing : accessibleLabel}
        aria-describedby=${this.description ? 'table-description' : nothing}
        aria-busy=${String(this.busy)}
      >
        ${
          this.caption
            ? html`<caption>
                ${this.caption}<span id="table-description" class="description"
                  >${this.description}</span
                >
              </caption>`
            : this.description
              ? html`<caption class="visually-hidden" id="table-description">
                  ${this.description}
                </caption>`
              : nothing
        }
        <thead>
          <tr>
            ${this.columns.map((column) => html`<th scope="col" class=${column.numeric ? 'numeric' : (column.align ?? 'start')} style=${column.width ? `width:${column.width}` : nothing} aria-sort=${this.sortKey === String(column.key) ? this.sortDirection : column.sortable ? 'none' : nothing}>${column.sortable ? html`<button class="sort ${column.numeric ? 'end' : (column.align ?? 'start')}" type="button" ?disabled=${this.busy} @click=${() => this.sort(column)}>${column.label}<span class="indicator" aria-hidden="true">${this.sortKey === String(column.key) ? (this.sortDirection === 'ascending' ? '↑' : '↓') : '↕'}</span></button>` : column.label}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${
            rows.length
              ? rows.map(
                  ({ row, index }) =>
                    html`<tr
                      data-interactive=${this.selectable ? true : nothing}
                      data-selected=${String(row[this.rowKey] ?? index) === this.selectedKey ? true : nothing}
                      tabindex=${this.selectable ? '0' : nothing}
                      @click=${(event: MouseEvent) => this.rowClick(event, row, index)}
                      @keydown=${(event: KeyboardEvent) => this.rowKeydown(event, row, index)}
                    >
                      ${this.columns.map((column) => {
                        const value = row[String(column.key)],
                          formatted = column.format?.(value, row) ?? value ?? '—';
                        const className = column.numeric ? 'numeric' : (column.align ?? 'start');
                        return column.rowHeader
                          ? html`<th scope="row" class=${className}>${formatted}</th>`
                          : html`<td class=${className}>${formatted}</td>`;
                      })}
                    </tr>`,
                )
              : html`<tr>
                  <td class="empty" colspan=${Math.max(1, this.columns.length)}>
                    ${this.emptyMessage}
                  </td>
                </tr>`
          }
        </tbody>
      </table>
      ${
        pageCount > 1
          ? html`<nav class="pagination" aria-label=${`${accessibleLabel} pagination`}>
              <span class="range">${firstRow}–${Math.max(0, lastRow)} of ${total} rows</span>
              <button
                type="button"
                aria-label="Previous page"
                ?disabled=${this.busy || this.page <= 1}
                @click=${() => this.changePage(this.page - 1)}
              >
                ‹
              </button>
              <span aria-current="page">Page ${this.page} of ${pageCount}</span>
              <button
                type="button"
                aria-label="Next page"
                ?disabled=${this.busy || this.page >= pageCount}
                @click=${() => this.changePage(this.page + 1)}
              >
                ›
              </button>
            </nav>`
          : nothing
      }
      ${
        this.busy
          ? html`<div class="busy" aria-hidden="true"><span class="spinner"></span></div>`
          : nothing
      }
      <span class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"
        >${this.announcement}</span
      >
    </div>`;
  }
}
