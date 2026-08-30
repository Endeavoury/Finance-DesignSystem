import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles } from '@endeavoury/finance-design-styles';
import { DsElement } from '../core/ds-element.js';

export class DsBreadcrumb extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      a {
        color: var(--ds-color-text-secondary);
        text-decoration: none;
      }
      a:hover {
        color: var(--ds-color-accent-hover);
        text-decoration: underline;
      }
      .current {
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-medium);
      }
      .separator {
        color: var(--ds-color-border-strong);
        user-select: none;
      }
      :host([disabled]) {
        pointer-events: none;
        opacity: 0.5;
      }
    `,
  ];

  @property() href = '';
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() separator = '/';

  protected override updated() {
    this.setAttribute('role', 'listitem');
  }

  protected override render() {
    const content = this.current
      ? html`<span class="current" aria-current="page"><slot></slot></span>`
      : this.href
        ? html`<a href=${this.href} aria-disabled=${this.disabled ? 'true' : nothing}
            ><slot></slot
          ></a>`
        : html`<span><slot></slot></span>`;
    return html`${content}${
      this.current
        ? nothing
        : html`<span class="separator" aria-hidden="true">${this.separator}</span>`
    }`;
  }
}

export class DsBreadcrumbs extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      nav {
        overflow-x: auto;
      }
      .list {
        display: flex;
        gap: var(--ds-space-2);
        align-items: center;
        width: max-content;
        min-width: 100%;
      }
    `,
  ];

  @property() label = 'Breadcrumb';

  protected override render() {
    return html`<nav part="navigation" aria-label=${this.label}>
      <div class="list" role="list"><slot></slot></div>
    </nav>`;
  }
}

export interface DsPageChangeDetail {
  page: number;
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

export class DsPagination extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ds-space-1);
        align-items: center;
      }
      button {
        display: grid;
        place-items: center;
        min-width: var(--ds-control-height-sm);
        height: var(--ds-control-height-sm);
        padding: 0 var(--ds-space-2);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        border-color: var(--ds-color-border-default);
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      button[aria-current='page'] {
        border-color: color-mix(
          in srgb,
          var(--ds-color-accent-primary) 38%,
          var(--ds-color-border-default)
        );
        background: var(--ds-color-bg-selected);
        color: var(--ds-color-accent-hover);
        font-weight: var(--ds-font-weight-semibold);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .ellipsis {
        display: grid;
        place-items: center;
        width: var(--ds-control-height-sm);
        color: var(--ds-color-text-muted);
      }
    `,
  ];

  @property({ type: Number, reflect: true }) page = 1;
  @property({ type: Number, reflect: true }) pages = 1;
  @property({ type: Number, attribute: 'sibling-count' }) siblingCount = 1;
  @property() label = 'Pagination';
  @property({ attribute: 'previous-label' }) previousLabel = 'Previous page';
  @property({ attribute: 'next-label' }) nextLabel = 'Next page';
  @property({ attribute: 'page-label' }) pageLabel = 'Page';
  @property({ type: Boolean, reflect: true }) disabled = false;

  private get tokens(): PageToken[] {
    const total = Math.max(1, this.pages);
    if (total <= 7 + this.siblingCount * 2)
      return Array.from({ length: total }, (_, index) => index + 1);
    const start = Math.max(2, this.page - this.siblingCount);
    const end = Math.min(total - 1, this.page + this.siblingCount);
    return [
      1,
      ...(start > 2 ? (['ellipsis-start'] as const) : []),
      ...Array.from({ length: end - start + 1 }, (_, index) => start + index),
      ...(end < total - 1 ? (['ellipsis-end'] as const) : []),
      total,
    ];
  }

  private select(page: number) {
    const next = Math.min(Math.max(1, page), Math.max(1, this.pages));
    if (this.disabled || next === this.page) return;
    this.page = next;
    this.emit<DsPageChangeDetail>('ds-page-change', { page: next });
  }

  protected override render() {
    return html`<nav part="navigation" aria-label=${this.label}>
      <button
        type="button"
        part="previous"
        aria-label=${this.previousLabel}
        ?disabled=${this.disabled || this.page <= 1}
        @click=${() => this.select(this.page - 1)}
      >
        ‹
      </button>
      ${this.tokens.map((token) =>
        typeof token === 'number'
          ? html`<button
              type="button"
              part="page"
              aria-label=${`${this.pageLabel} ${token}`}
              aria-current=${token === this.page ? 'page' : nothing}
              ?disabled=${this.disabled}
              @click=${() => this.select(token)}
            >
              ${token}
            </button>`
          : html`<span class="ellipsis" aria-hidden="true">…</span>`,
      )}
      <button
        type="button"
        part="next"
        aria-label=${this.nextLabel}
        ?disabled=${this.disabled || this.page >= this.pages}
        @click=${() => this.select(this.page + 1)}
      >
        ›
      </button>
    </nav>`;
  }
}

export interface DsListActivateDetail {
  value: string;
}

export class DsListItem extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        align-items: center;
        width: 100%;
        min-height: var(--ds-control-height-lg);
        padding: var(--ds-space-2) var(--ds-space-3);
        border: 0;
        border-radius: var(--ds-radius-md);
        background: transparent;
        color: var(--ds-color-text-primary);
        font: inherit;
        text-align: left;
        text-decoration: none;
      }
      button.item,
      a.item {
        cursor: pointer;
      }
      button.item:hover,
      a.item:hover {
        background: var(--ds-color-bg-hover);
      }
      :host([selected]) .item {
        background: var(--ds-color-bg-selected);
      }
      .content {
        min-width: 0;
      }
      .primary {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .supporting {
        margin-top: 0.125rem;
        overflow: hidden;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .leading,
      .trailing {
        display: inline-flex;
        color: var(--ds-color-text-muted);
      }
      :host([disabled]) {
        opacity: 0.5;
      }
    `,
  ];

  @property() value = '';
  @property() href = '';
  @property({ attribute: 'supporting-text' }) supportingText = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  protected override updated() {
    this.setAttribute('role', 'listitem');
  }

  private activate(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.emit<DsListActivateDetail>('ds-list-activate', { value: this.value });
  }

  protected override render() {
    const content = html`<span class="leading"><slot name="leading"></slot></span
      ><span class="content"
        ><span class="primary"><slot></slot></span>${
          this.supportingText
            ? html`<span class="supporting">${this.supportingText}</span>`
            : nothing
        }</span
      ><span class="trailing"><slot name="trailing"></slot></span>`;
    if (this.href)
      return html`<a
        class="item"
        part="item"
        href=${this.href}
        aria-current=${this.selected ? 'page' : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        @click=${this.activate}
        >${content}</a
      >`;
    if (this.value)
      return html`<button
        class="item"
        part="item"
        type="button"
        ?disabled=${this.disabled}
        aria-pressed=${String(this.selected)}
        @click=${this.activate}
      >
        ${content}
      </button>`;
    return html`<div class="item" part="item">${content}</div>`;
  }
}

export class DsList extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: grid;
        gap: var(--ds-space-1);
        padding: var(--ds-space-2);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
        box-shadow: var(--ds-shadow-sm);
      }
      :host([divided]) ::slotted(ds-list-item:not(:last-child)) {
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
    `,
  ];

  @property() label = 'List';
  @property({ type: Boolean, reflect: true }) divided = false;

  protected override render() {
    return html`<div part="list" role="list" aria-label=${this.label}><slot></slot></div>`;
  }
}
