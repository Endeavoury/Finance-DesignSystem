import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import {
  a11yStyles,
  foundationStyles,
  mediaCompact,
  responsiveBreakpoints,
  surfaceStyles,
} from '@endeavoury/kanosis-styles';
import { announce } from '../core/accessibility.js';
import { DsElement } from '../core/ds-element.js';

export interface DsValueDetail {
  value: string;
}

export interface DsDismissValueDetail extends DsValueDetail {
  reason: 'button' | 'keyboard';
}

export class DsLiveRegion extends DsElement {
  static override styles: CSSResultGroup = [foundationStyles, a11yStyles];
  @property() message = '';
  @property() politeness: 'polite' | 'assertive' = 'polite';
  protected override render() {
    return html`<span
      class="visually-hidden"
      role=${this.politeness === 'assertive' ? 'alert' : 'status'}
      aria-live=${this.politeness}
      aria-atomic="true"
      >${this.message}<slot></slot
    ></span>`;
  }
}

export class DsSegment extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      button {
        min-height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-4);
        border: 0;
        border-radius: var(--ds-shape-control);
        background: transparent;
        color: var(--ds-color-text-secondary);
        font: inherit;
        font-weight: var(--ds-font-weight-medium);
        cursor: pointer;
        transition:
          background var(--ds-motion-control),
          color var(--ds-motion-control),
          box-shadow var(--ds-motion-control);
      }
      button[aria-checked='true'] {
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-primary);
        box-shadow: var(--ds-shadow-control);
      }
      button:hover:not(:disabled) {
        background: var(--ds-color-bg-hover);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: var(--ds-opacity-disabled);
      }
    `,
  ];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = '';
  private requestSelection() {
    if (!this.disabled)
      this.emit<DsValueDetail>('ds-segment-request', {
        value: this.value || this.textContent?.trim() || '',
      });
  }
  protected override render() {
    return html`<button
      type="button"
      role="radio"
      aria-checked=${String(this.selected)}
      tabindex=${this.selected ? 0 : -1}
      ?disabled=${this.disabled}
      @click=${this.requestSelection}
    >
      <slot>${this.label}</slot>
    </button>`;
  }
}

export class DsSegmentedControl extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
        min-width: 0;
      }
      .group {
        display: inline-flex;
        max-width: 100%;
        gap: var(--ds-space-1);
        padding: var(--ds-space-1);
        overflow-x: auto;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-surface);
        background: var(--ds-color-bg-surface-subtle);
      }
    `,
  ];
  @property() value = '';
  @property() label = 'Options';
  @queryAssignedElements({ selector: 'ds-segment' }) private segments!: DsSegment[];

  protected override firstUpdated() {
    this.addEventListener('ds-segment-request', this.selectRequested as EventListener);
    this.sync();
  }
  override disconnectedCallback() {
    this.removeEventListener('ds-segment-request', this.selectRequested as EventListener);
    super.disconnectedCallback();
  }
  private selectRequested = (event: CustomEvent<DsValueDetail>) => {
    event.stopPropagation();
    this.select(event.detail.value);
  };
  private sync() {
    const enabled = this.segments.filter((segment) => !segment.disabled);
    if (!this.value && enabled[0]) this.value = enabled[0].value;
    for (const segment of this.segments) segment.selected = segment.value === this.value;
  }
  private select(value: string, focus = false) {
    const segment = this.segments.find((item) => item.value === value && !item.disabled);
    if (!segment || value === this.value) return;
    this.value = value;
    this.sync();
    if (focus) segment.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus();
    this.emit<DsValueDetail>('ds-change', { value });
  }
  private keydown(event: KeyboardEvent) {
    const enabled = this.segments.filter((segment) => !segment.disabled);
    if (!enabled.length) return;
    const current = Math.max(
      0,
      enabled.findIndex((segment) => segment.value === this.value),
    );
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (current + 1) % enabled.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (current - 1 + enabled.length) % enabled.length;
    else return;
    event.preventDefault();
    this.select(enabled[next]?.value ?? '', true);
  }
  protected override render() {
    return html`<div
      class="group"
      role="radiogroup"
      aria-label=${this.label}
      @keydown=${this.keydown}
    >
      <slot @slotchange=${this.sync}></slot>
    </div>`;
  }
}

export class DsActionBar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: var(--ds-space-2);
      }
      .actions {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: var(--ds-space-2);
        overflow: hidden;
      }
      details {
        position: relative;
        flex: 0 0 auto;
      }
      details:not([data-has-overflow]) {
        display: none;
      }
      summary {
        display: grid;
        min-width: var(--ds-control-height-md);
        min-height: var(--ds-control-height-md);
        place-items: center;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-control);
        background: var(--ds-color-bg-surface);
        cursor: pointer;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      .overflow {
        position: absolute;
        z-index: var(--ds-z-dropdown);
        inset-block-start: calc(100% + var(--ds-space-1));
        inset-inline-end: 0;
        display: grid;
        min-width: 12rem;
        gap: var(--ds-space-1);
        padding: var(--ds-space-2);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-surface);
        background: var(--ds-color-bg-elevated);
        box-shadow: var(--ds-elevation-overlay);
      }
      ::slotted([slot='overflow']) {
        width: 100%;
      }
      @media ${mediaCompact} {
        :host([collapse-at-compact]) ::slotted([data-overflow]) {
          display: none;
        }
        :host([collapse-at-compact]) details {
          display: block;
        }
      }
    `,
  ];
  @property() label = 'Actions';
  @property({ type: Boolean, reflect: true, attribute: 'collapse-at-compact' })
  collapseAtCompact = false;
  @query('.actions') private actionContainer!: HTMLElement;
  @state() private hasOverflow = false;
  private observer?: ResizeObserver;
  private reflowQueued = false;
  private autoOverflow = new Set<HTMLElement>();

  protected override firstUpdated() {
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.reflow());
      this.observer.observe(this);
    }
    this.reflow();
  }
  override disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
  private reflow() {
    if (this.reflowQueued) return;
    this.reflowQueued = true;
    globalThis.setTimeout(() => {
      this.reflowQueued = false;
      const compact =
        this.collapseAtCompact &&
        globalThis.matchMedia?.(`(max-width: ${responsiveBreakpoints.compact})`).matches;
      for (const child of this.autoOverflow) {
        child.slot = '';
        child.removeAttribute('data-auto-overflow');
      }
      this.autoOverflow.clear();
      for (const child of this.children) {
        if (child instanceof HTMLElement && child.hasAttribute('data-overflow')) {
          const slot = compact ? 'overflow' : '';
          if (child.slot !== slot) child.slot = slot;
        }
      }
      const candidates = [...this.children]
        .filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement &&
            child.slot !== 'overflow' &&
            child.getAttribute('data-priority') !== 'primary',
        )
        .reverse();
      while (
        this.actionContainer.scrollWidth > this.actionContainer.clientWidth &&
        candidates.length
      ) {
        const child = candidates.shift();
        if (!child) break;
        child.slot = 'overflow';
        child.setAttribute('data-auto-overflow', '');
        this.autoOverflow.add(child);
      }
      const hasOverflow = this.querySelector('[slot="overflow"]') !== null;
      if (this.hasOverflow !== hasOverflow) this.hasOverflow = hasOverflow;
    });
  }
  protected override render() {
    return html`<div class="actions" role="toolbar" aria-label=${this.label}>
        <slot @slotchange=${this.reflow}></slot>
      </div>
      <details ?data-has-overflow=${this.hasOverflow}>
        <summary aria-label="More actions">•••</summary>
        <div class="overflow"><slot name="overflow" @slotchange=${this.reflow}></slot></div>
      </details>`;
  }
}

export class DsSplitButton extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        position: relative;
        display: inline-flex;
      }
      .group {
        display: inline-flex;
      }
      button {
        min-height: var(--ds-control-height-md);
        border: 1px solid var(--ds-color-accent-primary);
        background: var(--ds-gradient-accent);
        color: var(--ds-color-text-inverse);
        font: inherit;
        font-weight: var(--ds-font-weight-semibold);
        cursor: pointer;
      }
      .primary {
        padding-inline: var(--ds-space-4);
        border-radius: var(--ds-shape-control) 0 0 var(--ds-shape-control);
      }
      .toggle {
        min-width: var(--ds-control-height-md);
        border-inline-start-color: var(--ds-color-highlight);
        border-radius: 0 var(--ds-shape-control) var(--ds-shape-control) 0;
      }
      :host-context([dir='rtl']) .primary {
        border-radius: 0 var(--ds-shape-control) var(--ds-shape-control) 0;
      }
      :host-context([dir='rtl']) .toggle {
        border-radius: var(--ds-shape-control) 0 0 var(--ds-shape-control);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: var(--ds-opacity-disabled);
      }
      .menu {
        position: absolute;
        z-index: var(--ds-z-dropdown);
        inset-block-start: calc(100% + var(--ds-space-1));
        inset-inline-end: 0;
        min-width: 12rem;
        padding: var(--ds-space-2);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-surface);
        background: var(--ds-color-bg-elevated);
        box-shadow: var(--ds-elevation-overlay);
        color: var(--ds-color-text-primary);
      }
    `,
  ];
  @property() label = 'Run';
  @property({ attribute: 'menu-label' }) menuLabel = 'Related actions';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  private primary() {
    if (!this.disabled) this.emit<void>('ds-activate', undefined);
  }
  private toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.emit<{ open: boolean }>('ds-menu-toggle', { open: this.open });
  }
  private keydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.open = false;
      this.shadowRoot?.querySelector<HTMLButtonElement>('.toggle')?.focus();
    }
  }
  protected override render() {
    return html`<div class="group" role="group" aria-label=${this.label} @keydown=${this.keydown}>
        <button class="primary" type="button" ?disabled=${this.disabled} @click=${this.primary}>
          <slot>${this.label}</slot>
        </button>
        <button
          class="toggle"
          type="button"
          aria-label=${this.menuLabel}
          aria-haspopup="menu"
          aria-expanded=${String(this.open)}
          ?disabled=${this.disabled}
          @click=${this.toggle}
        >
          ▾
        </button>
      </div>
      ${
        this.open
          ? html`<div
              class="menu"
              role="menu"
              aria-label=${this.menuLabel}
              @click=${() => (this.open = false)}
            >
              <slot name="menu"></slot>
            </div>`
          : nothing
      }`;
  }
}

export class DsInputGroup extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: flex;
        min-width: 0;
        align-items: stretch;
      }
      .group {
        display: flex;
        width: 100%;
        min-width: 0;
        align-items: stretch;
        overflow: hidden;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-control);
        background: var(--ds-color-bg-surface-subtle);
        box-shadow: var(--ds-shadow-control);
      }
      .affix {
        display: flex;
        align-items: center;
        padding-inline: var(--ds-space-3);
        color: var(--ds-color-text-muted);
      }
      .prefix {
        border-inline-end: 1px solid var(--ds-color-border-subtle);
      }
      .suffix {
        border-inline-start: 1px solid var(--ds-color-border-subtle);
      }
      .control {
        min-width: 0;
        flex: 1 1 auto;
      }
      ::slotted(*) {
        height: 100%;
      }
    `,
  ];
  @property() label = 'Input group';
  protected override render() {
    return html`<div class="group" role="group" aria-label=${this.label}>
      <span class="affix prefix"><slot name="prefix"></slot></span>
      <span class="control"><slot></slot></span>
      <span class="affix suffix"><slot name="suffix"></slot></span>
    </div>`;
  }
}

export class DsChip extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .chip {
        display: inline-flex;
        min-height: var(--ds-control-height-sm);
        align-items: center;
        gap: var(--ds-space-1);
        padding-inline: var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-secondary);
      }
      button {
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
      .select {
        padding: 0;
      }
      .dismiss {
        min-width: var(--ds-target-min);
        min-height: var(--ds-target-min);
        padding: 0;
        border-radius: var(--ds-radius-round);
      }
      :host([selected]) .chip {
        border-color: var(--ds-color-accent-primary);
        background: var(--ds-color-accent-soft);
        color: var(--ds-color-text-primary);
      }
      :host([disabled]) {
        opacity: var(--ds-opacity-disabled);
      }
    `,
  ];
  @property() value = '';
  @property() label = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  private select() {
    if (this.disabled) return;
    this.selected = !this.selected;
    this.emit<DsValueDetail & { selected: boolean }>('ds-change', {
      value: this.value,
      selected: this.selected,
    });
  }
  private dismiss(event: Event) {
    event.stopPropagation();
    if (!this.disabled)
      this.emit<DsDismissValueDetail>('ds-dismiss', { value: this.value, reason: 'button' });
  }
  protected override render() {
    return html`<span class="chip">
      <button
        class="select"
        type="button"
        aria-pressed=${String(this.selected)}
        ?disabled=${this.disabled}
        @click=${this.select}
      >
        <slot>${this.label}</slot>
      </button>
      ${
        this.dismissible
          ? html`<button
              class="dismiss"
              type="button"
              aria-label=${`Remove ${this.label || this.value}`}
              ?disabled=${this.disabled}
              @click=${this.dismiss}
            >
              ×
            </button>`
          : nothing
      }
    </span>`;
  }
}

export class DsIllustration extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-grid;
        width: var(--ds-illustration-size, 10rem);
        max-width: 100%;
        color: var(--ds-color-accent-primary);
      }
      svg {
        display: block;
        width: 100%;
        height: auto;
      }
      .soft {
        fill: var(--ds-color-accent-soft);
      }
      .line {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 5;
      }
    `,
  ];
  @property() variant: 'empty' | 'search' | 'success' | 'error' = 'empty';
  @property() label = '';
  protected override render() {
    const symbol = {
      empty: html`<path class="line" d="M42 48h76v62H42zM58 34h44l10 14H48zM62 75h36" />`,
      search: html`<circle class="line" cx="72" cy="68" r="30" /><path
          class="line"
          d="m94 90 25 25"
        />`,
      success: html`<circle class="line" cx="80" cy="80" r="48" /><path
          class="line"
          d="m55 80 17 17 35-39"
        />`,
      error: html`<circle class="line" cx="80" cy="80" r="48" /><path
          class="line"
          d="m61 61 38 38m0-38L61 99"
        />`,
    }[this.variant];
    return html`<svg
      viewBox="0 0 160 160"
      role=${this.label ? 'img' : 'presentation'}
      aria-label=${this.label || nothing}
      aria-hidden=${this.label ? nothing : 'true'}
    >
      <circle class="soft" cx="80" cy="80" r="70"></circle>
      ${symbol}
    </svg>`;
  }
}

export class DsBrandMark extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
      }
      svg {
        width: var(--ds-brand-mark-size, 2rem);
        height: var(--ds-brand-mark-size, 2rem);
        color: var(--ds-color-accent-primary);
      }
    `,
  ];
  @property() name = 'Kanosis';
  @property({ type: Boolean }) symbolOnly = false;
  protected override render() {
    return html`<svg
        viewBox="0 0 32 32"
        role=${this.symbolOnly ? 'img' : 'presentation'}
        aria-label=${this.symbolOnly ? this.name : nothing}
        aria-hidden=${this.symbolOnly ? nothing : 'true'}
      >
        <path fill="currentColor" d="M5 4h8v10l8-10h9L19 16l11 12h-10l-7-9v9H5z" />
      </svg>
      ${this.symbolOnly ? nothing : html`<span>${this.name}</span>`}`;
  }
}

export interface DsReorderDetail {
  value: string;
  fromIndex: number;
  toIndex: number;
  values: string[];
}

export class DsReorderItem extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .item {
        display: flex;
        align-items: center;
        gap: var(--ds-space-2);
        padding: var(--ds-space-2) var(--ds-space-3);
      }
      .content {
        min-width: 0;
        flex: 1 1 auto;
      }
      .handle {
        color: var(--ds-color-text-muted);
        cursor: grab;
      }
      .moves {
        display: inline-flex;
        gap: var(--ds-space-1);
      }
      button {
        min-width: var(--ds-target-min);
        min-height: var(--ds-target-min);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-shape-control);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-primary);
        cursor: pointer;
      }
      :host([dragging]) {
        opacity: 0.4;
      }
    `,
  ];
  @property({ reflect: true }) value = '';
  @property() label = '';
  @property({ type: Boolean, reflect: true }) dragging = false;
  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }
  private move(direction: -1 | 1) {
    this.emit<{ value: string; direction: -1 | 1 }>('ds-reorder-request', {
      value: this.value,
      direction,
    });
  }
  protected override render() {
    return html`<article class="item surface">
      <span class="handle" aria-hidden="true">⠿</span>
      <div class="content"><slot>${this.label}</slot></div>
      <div class="moves" aria-label=${`Move ${this.label || this.value}`}>
        <button
          type="button"
          aria-label=${`Move ${this.label || this.value} earlier`}
          @click=${() => this.move(-1)}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label=${`Move ${this.label || this.value} later`}
          @click=${() => this.move(1)}
        >
          ↓
        </button>
      </div>
    </article>`;
  }
}

export class DsReorderList extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: grid;
        gap: var(--ds-space-2);
      }
      .list {
        display: grid;
        gap: var(--ds-space-2);
      }
    `,
  ];
  @property() label = 'Reorder items';
  @queryAssignedElements({ selector: 'ds-reorder-item' }) private items!: DsReorderItem[];
  private dragged?: DsReorderItem;

  protected override firstUpdated() {
    this.addEventListener('ds-reorder-request', this.request as EventListener);
    this.configure();
  }
  override disconnectedCallback() {
    this.removeEventListener('ds-reorder-request', this.request as EventListener);
    super.disconnectedCallback();
  }
  private configure() {
    for (const item of this.items) {
      item.draggable = true;
      item.ondragstart = (event) => {
        this.dragged = item;
        item.dragging = true;
        event.dataTransfer?.setData('text/plain', item.value);
      };
      item.ondragend = () => {
        item.dragging = false;
        this.dragged = undefined;
      };
      item.ondragover = (event) => event.preventDefault();
      item.ondrop = (event) => {
        event.preventDefault();
        if (!this.dragged || this.dragged === item) return;
        this.move(this.items.indexOf(this.dragged), this.items.indexOf(item));
      };
    }
  }
  private request = (event: CustomEvent<{ value: string; direction: -1 | 1 }>) => {
    event.stopPropagation();
    const from = this.items.findIndex((item) => item.value === event.detail.value);
    this.move(from, from + event.detail.direction);
  };
  private move(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || toIndex < 0 || toIndex >= this.items.length || fromIndex === toIndex)
      return;
    const item = this.items[fromIndex];
    const target = this.items[toIndex];
    if (!item || !target) return;
    if (toIndex > fromIndex) target.after(item);
    else target.before(item);
    const values = this.items.map((entry) => entry.value);
    const detail = { value: item.value, fromIndex, toIndex, values };
    announce(
      `${item.label || item.value} moved to position ${toIndex + 1} of ${this.items.length}`,
      {
        document: this.ownerDocument,
      },
    );
    item.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus();
    this.emit<DsReorderDetail>('ds-reorder', detail);
    this.requestUpdate();
  }
  protected override render() {
    return html`<div class="list" role="list" aria-label=${this.label}>
      <slot @slotchange=${this.configure}></slot>
    </div>`;
  }
}
