import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { foundationStyles, mediaCompact } from '@endeavoury/kanosis-styles';
import { DsElement } from '../core/ds-element.js';

export interface DsCommand {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
}
export interface DsTenant {
  id: string;
  label: string;
  description?: string;
}
export interface DsWorkspaceTab {
  id: string;
  label: string;
  closable?: boolean;
}
export interface DsNotification {
  id: string;
  title: string;
  body?: string;
  read?: boolean;
  time?: string;
}
export interface DsDetailItem {
  label: string;
  value: string;
}

const p1Surface = css`
  :host {
    display: block;
    min-width: 0;
  }
  button,
  input,
  select {
    font: inherit;
  }
  button {
    min-height: var(--ds-control-height-sm);
    padding: 0 var(--ds-space-3);
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-md);
    background: var(--ds-color-bg-surface-subtle);
    color: var(--ds-color-text-primary);
    cursor: pointer;
  }
  button:hover {
    border-color: var(--ds-color-border-strong);
    background: var(--ds-color-bg-hover);
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--ds-color-focus);
    outline-offset: 2px;
  }
  .surface {
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
    box-shadow: var(--ds-shadow-panel);
  }
  .muted {
    color: var(--ds-color-text-muted);
    font-size: var(--ds-font-size-sm);
  }
`;

const overlayStyles = css`
  :host {
    position: fixed;
    z-index: var(--ds-z-overlay);
    inset: 0;
    display: grid;
    place-items: start center;
    padding: min(16vh, 8rem) var(--ds-space-4);
    pointer-events: none;
  }
  :host([open]) {
    pointer-events: auto;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: var(--ds-color-overlay);
    opacity: 0;
    transition: opacity var(--ds-duration-normal) var(--ds-ease-standard);
  }
  :host([open]) .backdrop {
    opacity: 1;
  }
  .panel {
    position: relative;
    width: min(100%, 42rem);
    max-height: min(70dvh, 40rem);
    overflow: hidden;
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-xl);
    background: var(--ds-color-bg-elevated);
    box-shadow: var(--ds-shadow-lg);
    transform: translateY(-0.5rem) scale(0.98);
    opacity: 0;
    transition:
      transform var(--ds-duration-normal) var(--ds-ease-emphasized),
      opacity var(--ds-duration-fast) var(--ds-ease-standard);
  }
  :host([open]) .panel {
    transform: none;
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .backdrop,
    .panel {
      transition: none;
    }
  }
`;

export class DsCommandPalette extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    overlayStyles,
    css`
      .search {
        display: flex;
        align-items: center;
        gap: var(--ds-space-3);
        padding: var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      input {
        width: 100%;
        height: var(--ds-control-height-lg);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
      ul {
        max-height: 28rem;
        overflow: auto;
        margin: 0;
        padding: var(--ds-space-2);
        list-style: none;
      }
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-3);
        padding: var(--ds-space-3);
        border-radius: var(--ds-radius-md);
        cursor: pointer;
      }
      li[data-active],
      li:hover {
        background: var(--ds-color-bg-selected);
      }
      .copy {
        min-width: 0;
      }
      .description {
        display: block;
        margin-top: 0.125rem;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      kbd {
        flex: 0 0 auto;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: false }) commands: DsCommand[] = [];
  @property() placeholder = 'Search commands';
  @property() closeLabel = 'Close command palette';
  @state() private query = '';
  @state() private activeIndex = 0;
  private filteredCommands() {
    const query = this.query.trim().toLocaleLowerCase();
    return this.commands.filter(
      (command) =>
        !query ||
        `${command.label} ${command.description ?? ''}`.toLocaleLowerCase().includes(query),
    );
  }
  private keydown(event: KeyboardEvent) {
    const matches = this.filteredCommands();
    if (event.key === 'Escape') {
      event.preventDefault();
      this.open = false;
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (matches.length)
        this.activeIndex =
          (this.activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) %
          matches.length;
    } else if (event.key === 'Enter' && matches[this.activeIndex]) {
      this.select(matches[this.activeIndex]!);
    }
  }
  private select(command: DsCommand) {
    this.emit<{ id: string }>('ds-command-select', { id: command.id });
    this.open = false;
  }
  protected override render() {
    const matches = this.filteredCommands();
    return html`<button
        class="backdrop"
        aria-label=${this.closeLabel}
        @click=${() => (this.open = false)}
      ></button>
      <section class="panel" role="dialog" aria-label="Command palette" aria-modal="true">
        <div class="search">
          <input
            type="search"
            placeholder=${this.placeholder}
            .value=${this.query}
            @input=${(event: Event) => {
              this.query = (event.target as HTMLInputElement).value;
              this.activeIndex = 0;
            }}
            @keydown=${this.keydown}
          />
        </div>
        <ul>
          ${
            matches.length
              ? matches.map(
                  (command, index) =>
                    html`<li
                      data-active=${index === this.activeIndex ? '' : nothing}
                      @click=${() => this.select(command)}
                    >
                      <span class="copy"
                        ><strong>${command.label}</strong
                        >${command.description ? html`<span class="description">${command.description}</span>` : nothing}</span
                      >${command.shortcut ? html`<kbd>${command.shortcut}</kbd>` : nothing}
                    </li>`,
                )
              : html`<li class="muted">No matching commands</li>`
          }
        </ul>
      </section>`;
  }
}

export class DsGlobalSearch extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .search {
        display: flex;
        align-items: center;
        gap: var(--ds-space-2);
      }
      input {
        width: 100%;
        min-width: 12rem;
        height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
      button {
        flex: 0 0 auto;
      }
    `,
  ];
  @property() query = '';
  @property() placeholder = 'Search everything';
  @property() label = 'Global search';
  private submit() {
    this.emit<{ query: string }>('ds-search-submit', { query: this.query });
  }
  protected override render() {
    return html`<form
      class="search"
      aria-label=${this.label}
      @submit=${(event: Event) => {
        event.preventDefault();
        this.submit();
      }}
    >
      <input
        type="search"
        .value=${this.query}
        placeholder=${this.placeholder}
        @input=${(event: Event) => (this.query = (event.target as HTMLInputElement).value)}
      /><button type="submit">Search</button>
    </form>`;
  }
}

export class DsTenantSwitcher extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      select {
        width: 100%;
        min-height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
    `,
  ];
  @property({ attribute: false }) tenants: DsTenant[] = [];
  @property() value = '';
  @property() label = 'Workspace';
  private change(event: Event) {
    this.value = (event.target as HTMLSelectElement).value;
    this.emit<{ id: string }>('ds-tenant-change', { id: this.value });
  }
  protected override render() {
    return html`<label class="surface" style="display:grid;gap:.25rem;padding:.5rem .75rem"
      ><span class="muted">${this.label}</span
      ><select aria-label=${this.label} .value=${this.value} @change=${this.change}>
        ${this.tenants.map((tenant) => html`<option value=${tenant.id}>${tenant.label}</option>`)}
      </select></label
    >`;
  }
}

export class DsUserMenu extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .menu {
        position: relative;
        display: inline-block;
      }
      .panel {
        position: absolute;
        z-index: var(--ds-z-popover);
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 12rem;
        padding: var(--ds-space-2);
      }
      .panel ::slotted(*) {
        display: block;
        width: 100%;
      }
    `,
  ];
  @property() name = 'User';
  @property() label = 'Open user menu';
  @property({ type: Boolean, reflect: true }) open = false;
  protected override render() {
    return html`<div class="menu">
      <button
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${() => (this.open = !this.open)}
      >
        ${this.name}</button
      >${this.open ? html`<div class="panel surface" role="menu"><slot></slot></div>` : nothing}
    </div>`;
  }
}

export class DsWorkspaceTabs extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      nav {
        display: flex;
        min-width: 0;
        gap: var(--ds-space-1);
        overflow-x: auto;
        padding: var(--ds-space-1);
      }
      .tab {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 0 0 auto;
        padding: var(--ds-space-2) var(--ds-space-3);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-md);
        background: transparent;
        color: var(--ds-color-text-muted);
        cursor: pointer;
      }
      .tab[aria-selected='true'] {
        border-color: var(--ds-color-border-default);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-primary);
        box-shadow: var(--ds-shadow-control);
      }
      .close {
        min-height: 1.25rem;
        padding: 0 0.25rem;
        border: 0;
        background: transparent;
      }
    `,
  ];
  @property({ attribute: false }) tabs: DsWorkspaceTab[] = [];
  @property() value = '';
  private select(id: string) {
    this.value = id;
    this.emit<{ id: string }>('ds-tab-change', { id });
  }
  private close(id: string, event: Event) {
    event.stopPropagation();
    this.emit<{ id: string }>('ds-tab-close', { id });
  }
  protected override render() {
    return html`<nav class="surface" role="tablist" aria-label="Workspace tabs">
      ${this.tabs.map((tab) => html`<div class="tab" role="tab" tabindex="0" aria-selected=${tab.id === this.value} @click=${() => this.select(tab.id)}>${tab.label}${tab.closable ? html`<button class="close" type="button" aria-label=${`Close ${tab.label}`} @click=${(event: Event) => this.close(tab.id, event)}>×</button>` : nothing}</div>`)}
    </nav>`;
  }
}

export class DsNavigationGroup extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      details {
        overflow: clip;
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-2);
        padding: var(--ds-space-2) var(--ds-space-3);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-semibold);
        cursor: pointer;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      .content {
        display: grid;
        gap: 0.125rem;
        padding: 0 var(--ds-space-1) var(--ds-space-2);
      }
    `,
  ];
  @property() label = 'Navigation';
  @property({ type: Boolean, reflect: true }) open = true;
  protected override render() {
    return html`<details
      .open=${this.open}
      @toggle=${(event: Event) => (this.open = (event.target as HTMLDetailsElement).open)}
    >
      <summary>${this.label}<span aria-hidden="true">⌄</span></summary>
      <div class="content"><slot></slot></div>
    </details>`;
  }
}

export class DsContextMenu extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .menu {
        position: relative;
        display: inline-block;
      }
      .panel {
        position: absolute;
        z-index: var(--ds-z-popover);
        top: calc(100% + 0.25rem);
        left: 0;
        min-width: 12rem;
        padding: var(--ds-space-1);
      }
      .panel ::slotted(*) {
        display: block;
        width: 100%;
        text-align: left;
      }
    `,
  ];
  @property() label = 'More actions';
  @property({ type: Boolean, reflect: true }) open = false;
  protected override render() {
    return html`<div class="menu">
      <button
        aria-haspopup="menu"
        aria-expanded=${this.open}
        @click=${() => (this.open = !this.open)}
      >
        ${this.label}</button
      >${this.open ? html`<div class="panel surface" role="menu"><slot></slot></div>` : nothing}
    </div>`;
  }
}

export class DsQuickActions extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--ds-space-2);
        min-width: 0;
      }
    `,
  ];
  protected override render() {
    return html`<slot></slot>`;
  }
}

export class DsRecordHeader extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--ds-space-4);
        align-items: start;
        padding: var(--ds-space-5) var(--ds-space-6);
      }
      h1 {
        margin: 0;
        font-size: var(--ds-font-size-2xl);
        line-height: var(--ds-line-height-tight);
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ds-space-2);
        margin-top: var(--ds-space-2);
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .actions {
        display: flex;
        gap: var(--ds-space-2);
      }
      @media ${mediaCompact} {
        .header {
          grid-template-columns: 1fr;
          padding: var(--ds-space-4);
        }
      }
    `,
  ];
  @property() heading = '';
  @property() description = '';
  @property() status = '';
  protected override render() {
    return html`<header class="header surface">
      <div>
        <h1>${this.heading}</h1>
        ${this.description ? html`<p class="muted">${this.description}</p>` : nothing}
        <div class="meta">
          ${this.status ? html`<span>${this.status}</span>` : nothing}<slot name="meta"></slot>
        </div>
      </div>
      <div class="actions"><slot name="actions"></slot></div>
    </header>`;
  }
}

export class DsDetailList extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      dl {
        display: grid;
        grid-template-columns: minmax(8rem, 0.65fr) minmax(0, 1.35fr);
        margin: 0;
      }
      dt,
      dd {
        margin: 0;
        padding: var(--ds-space-3) var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      dt {
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      dd {
        color: var(--ds-color-text-primary);
      }
      @media ${mediaCompact} {
        dl {
          grid-template-columns: 1fr;
        }
        dd {
          padding-top: 0;
        }
      }
    `,
  ];
  @property({ attribute: false }) items: DsDetailItem[] = [];
  protected override render() {
    return html`<dl class="surface">
      ${this.items.map(
        (item) =>
          html`<dt>${item.label}</dt>
            <dd>${item.value}</dd>`,
      )}
    </dl>`;
  }
}

export class DsNotificationCenter extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .center {
        position: relative;
        display: inline-block;
      }
      .badge {
        position: absolute;
        top: -0.35rem;
        right: -0.35rem;
        min-width: 1.15rem;
        padding: 0.1rem 0.3rem;
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-danger);
        color: var(--ds-color-text-inverse);
        font-size: var(--ds-font-size-xs);
        text-align: center;
      }
      .panel {
        position: absolute;
        z-index: var(--ds-z-popover);
        top: calc(100% + 0.5rem);
        right: 0;
        width: min(24rem, calc(100vw - 2rem));
        max-height: 28rem;
        overflow: auto;
        padding: var(--ds-space-2);
      }
      .notification {
        padding: var(--ds-space-3);
        border-radius: var(--ds-radius-md);
      }
      .notification:not([data-read]) {
        background: var(--ds-color-bg-selected);
      }
    `,
  ];
  @property({ attribute: false }) notifications: DsNotification[] = [];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = 'Notifications';
  private markRead(id: string) {
    this.emit<{ id: string }>('ds-notification-read', { id });
  }
  protected override render() {
    const unread = this.notifications.filter((notification) => !notification.read).length;
    return html`<div class="center">
      <button
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${() => (this.open = !this.open)}
      >
        🔔${unread ? html`<span class="badge">${unread}</span>` : nothing}</button
      >${this.open ? html`<section class="panel surface" aria-label=${this.label}>${this.notifications.length ? this.notifications.map((notification) => html`<article class="notification" ?data-read=${notification.read} @click=${() => this.markRead(notification.id)}><strong>${notification.title}</strong>${notification.time ? html`<span class="muted"> · ${notification.time}</span>` : nothing}${notification.body ? html`<p>${notification.body}</p>` : nothing}</article>`) : html`<p class="muted">No notifications</p>`}</section>` : nothing}
    </div>`;
  }
}

export class DsBanner extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p1Surface,
    css`
      .banner {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--ds-space-4);
        padding: var(--ds-space-3) var(--ds-space-4);
      }
      .copy {
        min-width: 0;
      }
      .close {
        flex: 0 0 auto;
        border: 0;
        background: transparent;
        font-size: 1.2rem;
      }
    `,
  ];
  @property() heading = '';
  @property({ type: Boolean, reflect: true }) dismissible = false;
  private close() {
    this.emit<void>('ds-dismiss', undefined);
  }
  protected override render() {
    return html`<aside class="banner surface" role="status">
      <div class="copy">
        ${this.heading ? html`<strong>${this.heading}</strong>` : nothing}
        <div><slot></slot></div>
      </div>
      ${this.dismissible ? html`<button class="close" type="button" aria-label="Dismiss" @click=${this.close}>×</button>` : nothing}
    </aside>`;
  }
}
