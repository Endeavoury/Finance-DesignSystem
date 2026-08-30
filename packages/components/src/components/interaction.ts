import { css, html, type CSSResultGroup, type PropertyValues } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { foundationStyles, surfaceStyles } from '@endeavoury/finance-design-styles';
import { DsElement } from '../core/ds-element.js';

export type DsTheme = 'light' | 'dark';

export interface DsThemeChangeDetail {
  theme: DsTheme;
}

export class DsThemeToggle extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      button {
        display: grid;
        place-items: center;
        width: var(--ds-control-height-md);
        height: var(--ds-control-height-md);
        padding: 0;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
        color: var(--ds-color-text-secondary);
        box-shadow: var(--ds-shadow-control);
        cursor: pointer;
        transition:
          background var(--ds-duration-fast) var(--ds-ease-standard),
          border-color var(--ds-duration-fast) var(--ds-ease-standard),
          color var(--ds-duration-fast) var(--ds-ease-standard),
          transform var(--ds-duration-fast) var(--ds-ease-standard);
      }
      button:hover {
        border-color: var(--ds-color-border-strong);
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
        transform: translateY(-1px);
      }
      button:active {
        transform: translateY(1px);
      }
      .glyph {
        width: var(--ds-icon-md);
        height: var(--ds-icon-md);
        font-size: 1.05rem;
        line-height: 0.9;
      }
    `,
  ];

  @property({ reflect: true }) theme: DsTheme = 'dark';
  @property({ attribute: 'light-label' }) lightLabel = 'Switch to light theme';
  @property({ attribute: 'dark-label' }) darkLabel = 'Switch to dark theme';
  @property({ attribute: 'storage-key' }) storageKey = '';

  override connectedCallback() {
    super.connectedCallback();
    if (!this.storageKey) return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored === 'light' || stored === 'dark') this.theme = stored;
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    if (!changed.has('theme') && !changed.has('storageKey')) return;
    this.ownerDocument.documentElement.dataset['dsTheme'] = this.theme;
    if (!this.storageKey) return;
    try {
      localStorage.setItem(this.storageKey, this.theme);
    } catch {
      // Theme switching remains functional when persistence is unavailable.
    }
  }

  private toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.emit<DsThemeChangeDetail>('ds-theme-change', { theme: this.theme });
  }

  protected override render() {
    const label = this.theme === 'dark' ? this.lightLabel : this.darkLabel;
    return html`<button
      part="button"
      type="button"
      aria-label=${label}
      title=${label}
      @click=${this.toggle}
    >
      <span class="glyph" aria-hidden="true">${this.theme === 'dark' ? '☀' : '☾'}</span>
    </button>`;
  }
}

export interface DsTabChangeDetail {
  value: string;
}

export class DsTab extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property() value = '';
  @property() label = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) active = false;

  protected override updated() {
    this.setAttribute('role', 'tabpanel');
    this.setAttribute('aria-label', this.label);
    this.tabIndex = 0;
    this.toggleAttribute('hidden', !this.active);
  }

  protected override render() {
    return html`<div part="panel"><slot></slot></div>`;
  }
}

let tabsId = 0;

export class DsTabs extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .tablist {
        display: flex;
        gap: var(--ds-space-1);
        max-width: 100%;
        padding: var(--ds-space-1);
        overflow-x: auto;
        border: 1px solid var(--ds-color-border-subtle);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-sunken);
        scrollbar-width: thin;
      }
      button {
        flex: 0 0 auto;
        min-height: var(--ds-control-height-sm);
        padding: 0 var(--ds-space-3);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-semibold);
        cursor: pointer;
      }
      button:hover:not(:disabled) {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      button[aria-selected='true'] {
        border-color: var(--ds-color-border-default);
        background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
        color: var(--ds-color-text-primary);
        box-shadow: var(--ds-shadow-control);
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .panels {
        margin-top: var(--ds-space-4);
      }
    `,
  ];

  @property({ reflect: true }) value = '';
  @property() label = 'Sections';
  @queryAssignedElements({ selector: 'ds-tab' }) private assignedTabs!: DsTab[];
  @state() private tabs: DsTab[] = [];
  private readonly instanceId = `ds-tabs-${++tabsId}`;

  private syncTabs() {
    this.tabs = [...this.assignedTabs];
    const enabled = this.tabs.filter((tab) => !tab.disabled);
    if (!enabled.some((tab) => tab.value === this.value)) this.value = enabled[0]?.value ?? '';
    this.syncTabState();
  }

  private syncTabState() {
    this.tabs.forEach((tab) => {
      tab.active = tab.value === this.value;
    });
  }

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has('value')) this.syncTabState();
  }

  private select(tab: DsTab, focus = false) {
    if (tab.disabled || tab.value === this.value) return;
    this.value = tab.value;
    this.emit<DsTabChangeDetail>('ds-tab-change', { value: tab.value });
    if (focus)
      void this.updateComplete.then(() =>
        this.shadowRoot
          ?.querySelector<HTMLButtonElement>(`button[data-value="${CSS.escape(tab.value)}"]`)
          ?.focus(),
      );
  }

  private keydown(event: KeyboardEvent) {
    const enabled = this.tabs.filter((tab) => !tab.disabled);
    if (!enabled.length) return;
    const current = Math.max(
      0,
      enabled.findIndex((tab) => tab.value === this.value),
    );
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (current + 1) % enabled.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (current - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = enabled.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    this.select(enabled[next]!, true);
  }

  protected override render() {
    return html`<div
        class="tablist"
        part="tablist"
        role="tablist"
        aria-label=${this.label}
        @keydown=${this.keydown}
      >
        ${this.tabs.map(
          (tab, index) =>
            html`<button
              id=${`${this.instanceId}-tab-${index}`}
              part="tab"
              type="button"
              role="tab"
              data-value=${tab.value}
              aria-selected=${String(tab.value === this.value)}
              tabindex=${tab.value === this.value ? 0 : -1}
              ?disabled=${tab.disabled}
              @click=${() => this.select(tab)}
            >
              ${tab.label}
            </button>`,
        )}
      </div>
      <div class="panels" part="panels"><slot @slotchange=${this.syncTabs}></slot></div>`;
  }
}

export interface DsDisclosureChangeDetail {
  open: boolean;
}

export class DsDisclosure extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      details {
        overflow: clip;
      }
      summary {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        align-items: center;
        min-height: var(--ds-control-height-lg);
        padding: var(--ds-space-3) var(--ds-space-4);
        color: var(--ds-color-text-primary);
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-semibold);
        cursor: pointer;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary:hover {
        background: var(--ds-color-bg-hover);
      }
      .chevron {
        color: var(--ds-color-text-muted);
        transition: transform var(--ds-duration-fast) var(--ds-ease-standard);
      }
      details[open] .chevron {
        transform: rotate(180deg);
      }
      .content {
        padding: 0 var(--ds-space-4) var(--ds-space-4);
        border-top: 1px solid var(--ds-color-border-subtle);
        color: var(--ds-color-text-secondary);
      }
      :host([disabled]) {
        opacity: 0.55;
      }
      :host([disabled]) summary {
        cursor: not-allowed;
      }
    `,
  ];

  @property() summary = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private beforeToggle(event: Event) {
    if (!this.disabled) return;
    event.preventDefault();
  }

  private toggled(event: Event) {
    if (this.disabled) return;
    const open = (event.currentTarget as HTMLDetailsElement).open;
    if (open === this.open) return;
    this.open = open;
    this.emit<DsDisclosureChangeDetail>('ds-disclosure-change', { open: this.open });
  }

  protected override render() {
    return html`<details
      class="surface"
      part="details"
      .open=${this.open}
      @click=${this.beforeToggle}
      @toggle=${this.toggled}
    >
      <summary part="summary" aria-disabled=${String(this.disabled)}>
        <span><slot name="summary">${this.summary}</slot></span
        ><span class="chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="content" part="content"><slot></slot></div>
    </details>`;
  }
}
