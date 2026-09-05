import { css, html, nothing, type CSSResultGroup, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { foundationStyles, mediaMedium } from '@endeavoury/kanosis-styles';
import { DsElement } from '../core/ds-element.js';

export interface DsActivateDetail {
  value: string;
}
export class DsSidebarItem extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.6875rem;
        width: 100%;
        min-height: 2.625rem;
        padding: 0 0.8125rem;
        border: 1px solid transparent;
        border-radius: var(--ds-radius-md);
        background: transparent;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-medium);
        text-decoration: none;
        cursor: pointer;
        text-align: left;
        transition:
          background var(--ds-duration-fast) var(--ds-ease-standard),
          border-color var(--ds-duration-fast) var(--ds-ease-standard),
          color var(--ds-duration-fast) var(--ds-ease-standard),
          transform var(--ds-duration-fast) var(--ds-ease-standard);
      }
      .item::before {
        content: '';
        position: absolute;
        left: -1px;
        top: 0.5rem;
        bottom: 0.5rem;
        width: 2px;
        border-radius: 2px;
        background: transparent;
      }
      .item:hover {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
        transform: translateX(2px);
      }
      :host([active]) .item {
        background: linear-gradient(
          90deg,
          var(--ds-color-bg-selected),
          color-mix(in srgb, var(--ds-color-bg-selected) 58%, transparent)
        );
        border-color: color-mix(
          in srgb,
          var(--ds-color-accent-primary) 18%,
          var(--ds-color-border-default)
        );
        color: var(--ds-color-text-primary);
        box-shadow: inset 0 1px 0 var(--ds-color-border-highlight);
      }
      :host([active]) .item::before {
        background: var(--ds-color-accent-primary);
      }
      .icon {
        display: inline-flex;
        width: 1.125rem;
        height: 1.125rem;
        flex: 0 0 auto;
        color: var(--ds-color-text-muted);
      }
      :host([active]) .icon {
        color: var(--ds-color-accent-hover);
      }
      .label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @media ${mediaMedium} {
        .item {
          min-height: 3.25rem;
          flex-direction: column;
          justify-content: center;
          gap: var(--ds-space-1);
          padding: var(--ds-space-1);
          font-size: 0.625rem;
        }
        .item::before {
          inset: auto 0.75rem 0;
          height: 2px;
          width: auto;
        }
      }
    `,
  ];
  @property() value = '';
  @property() href = '';
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean }) disabled = false;
  private activate(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.emit<DsActivateDetail>('ds-activate', { value: this.value });
  }
  protected override render() {
    const content = html`<span class="icon"><slot name="icon"></slot></span
      ><span class="label"><slot></slot></span>`;
    return this.href
      ? html`<a
          class="item"
          part="item"
          href=${this.href}
          aria-current=${this.active ? 'page' : nothing}
          aria-disabled=${this.disabled ? 'true' : nothing}
          @click=${this.activate}
          >${content}</a
        >`
      : html`<button
          class="item"
          part="item"
          type="button"
          ?disabled=${this.disabled}
          aria-current=${this.active ? 'page' : nothing}
          @click=${this.activate}
        >
          ${content}
        </button>`;
  }
}

export class DsSidebar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: var(--ds-shell-sidebar-width);
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        padding: 1.125rem;
        border-right: 1px solid var(--ds-color-border-subtle);
        background: linear-gradient(
          180deg,
          var(--ds-color-bg-surface-subtle),
          color-mix(in srgb, var(--ds-color-bg-sunken) 78%, var(--ds-color-bg-surface-subtle))
        );
        box-shadow: inset -1px 0 0
          color-mix(in srgb, var(--ds-color-border-highlight) 52%, transparent);
      }
      :host([collapsed]) {
        display: none;
      }
      .brand {
        padding: var(--ds-space-2) var(--ds-space-2) var(--ds-space-8);
      }
      nav {
        display: flex;
        min-height: 0;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 0.1875rem;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
        scrollbar-width: thin;
        scrollbar-color: var(--ds-color-border-strong) transparent;
      }
      nav::-webkit-scrollbar {
        width: var(--ds-scrollbar-size);
        height: var(--ds-scrollbar-size);
      }
      nav::-webkit-scrollbar-thumb {
        border: 0.1875rem solid transparent;
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-border-strong);
        background-clip: padding-box;
      }
      .footer {
        flex: 0 0 auto;
        padding-top: var(--ds-space-4);
      }
      @media ${mediaMedium} {
        :host {
          width: auto;
          height: auto;
          padding: var(--ds-space-2) max(var(--ds-space-2), env(safe-area-inset-right))
            calc(var(--ds-space-2) + env(safe-area-inset-bottom))
            max(var(--ds-space-2), env(safe-area-inset-left));
          border-top: 1px solid var(--ds-color-border-default);
          border-right: 0;
          background: color-mix(in srgb, var(--ds-color-bg-surface-subtle) 94%, transparent);
          backdrop-filter: blur(16px);
        }
        .brand,
        .footer {
          display: none;
        }
        nav {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          gap: var(--ds-space-1);
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-inline: contain;
          scrollbar-gutter: auto;
          scrollbar-width: none;
        }
        nav::-webkit-scrollbar {
          display: none;
        }
        ::slotted(ds-sidebar-item) {
          flex: 1;
          min-width: 0;
          max-width: 6rem;
        }
      }
    `,
  ];
  @property() label = 'Primary navigation';
  @property({ type: Boolean, reflect: true }) collapsed = false;
  protected override render() {
    return html`<div class="brand" part="brand"><slot name="brand"></slot></div>
      <nav part="navigation" aria-label=${this.label}><slot></slot></nav>
      <div class="footer" part="footer"><slot name="footer"></slot></div>`;
  }
}

export class DsAppShell extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        position: relative;
        z-index: var(--ds-z-shell);
        display: grid;
        grid-template-columns: var(--ds-shell-sidebar-width) minmax(0, 1fr);
        width: 100%;
        height: 100dvh;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        background:
          radial-gradient(
            circle at 76% -12%,
            color-mix(in srgb, var(--ds-color-accent-soft) 36%, transparent),
            transparent 34rem
          ),
          var(--ds-color-bg-canvas);
      }
      .sidebar {
        z-index: var(--ds-z-navigation);
        min-width: 0;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        transition:
          transform var(--ds-duration-normal) var(--ds-ease-emphasized),
          opacity var(--ds-duration-fast) var(--ds-ease-standard),
          visibility 0s linear 0s;
      }
      ::slotted([slot='sidebar']) {
        width: 100%;
        max-width: 100%;
        min-width: 0;
        min-height: 0;
      }
      :host([sidebar-collapsed]) {
        grid-template-columns: 0 minmax(0, 1fr);
      }
      :host([sidebar-collapsed]) .sidebar {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
        transform: translateX(-100%);
        transition-delay: 0s, 0s, var(--ds-duration-normal);
      }
      .workspace {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }
      .header {
        position: relative;
        z-index: var(--ds-z-pane-header);
        min-width: 0;
        min-height: 4.5rem;
        border-bottom: 1px solid var(--ds-color-border-subtle);
        background: color-mix(in srgb, var(--ds-color-bg-surface-subtle) 86%, transparent);
        box-shadow: 0 1px 0 color-mix(in srgb, var(--ds-color-border-highlight) 48%, transparent);
        backdrop-filter: blur(22px) saturate(130%);
      }
      .header {
        display: flex;
        align-items: center;
      }
      .header slot {
        flex: 1;
        min-width: 0;
      }
      .sidebar-toggle {
        flex: 0 0 auto;
        display: inline-grid;
        place-items: center;
        min-width: var(--ds-target-min);
        min-height: var(--ds-target-min);
        margin-inline: var(--ds-space-3) 0;
        padding: var(--ds-space-2);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-primary);
        cursor: pointer;
      }
      .sidebar-toggle:hover {
        background: var(--ds-color-bg-hover);
      }
      .sidebar-toggle svg {
        width: 1.25rem;
        height: 1.25rem;
      }
      .header[hidden] {
        display: none;
      }
      .main {
        flex: 1 1 0;
        min-width: 0;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
        scrollbar-width: thin;
        scrollbar-color: var(--ds-color-border-strong) transparent;
        -webkit-overflow-scrolling: touch;
        padding: var(--ds-space-8);
      }
      .main::-webkit-scrollbar {
        width: var(--ds-scrollbar-size);
        height: var(--ds-scrollbar-size);
      }
      .main::-webkit-scrollbar-thumb {
        border: 0.1875rem solid transparent;
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-border-strong);
        background-clip: padding-box;
      }
      .workspace-body {
        position: relative;
        display: flex;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }
      slot[name='inspector'] {
        display: contents;
      }
      ::slotted([slot='inspector']) {
        flex: 0 0 auto;
        min-width: 0;
        min-height: 0;
        max-width: 100%;
      }
      :host([content-mode='pane']) .main {
        padding: 0;
        overflow: hidden;
        scrollbar-gutter: auto;
      }
      @media ${mediaMedium} {
        :host,
        :host([sidebar-collapsed]) {
          position: relative;
          grid-template-columns: minmax(0, 1fr);
        }
        .sidebar {
          position: absolute;
          z-index: var(--ds-z-navigation);
          inset: auto 0 0;
          height: auto;
        }
        :host([sidebar-collapsed]) .sidebar {
          transform: translateY(100%);
        }
        .header {
          min-height: 4rem;
        }
        .main {
          padding: var(--ds-space-4) var(--ds-space-3) calc(5rem + env(safe-area-inset-bottom));
        }
        :host([content-mode='pane']) .main {
          padding: 0 0 calc(5rem + env(safe-area-inset-bottom));
        }
        :host([sidebar-collapsed]) .main {
          padding-bottom: var(--ds-space-4);
        }
        :host([content-mode='pane'][sidebar-collapsed]) .main {
          padding: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
        }
      }
    `,
  ];
  @property({ attribute: 'content-mode', reflect: true }) contentMode: 'scroll' | 'pane' = 'scroll';
  @property({ attribute: 'sidebar-collapsed', type: Boolean, reflect: true }) sidebarCollapsed =
    false;
  @property({ attribute: 'collapse-sidebar-label' }) collapseSidebarLabel = 'Collapse sidebar';
  @property({ attribute: 'expand-sidebar-label' }) expandSidebarLabel = 'Expand sidebar';
  @state() private hasHeader = false;
  @state() private hasSidebar = false;

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has('sidebarCollapsed') && this.sidebarCollapsed) {
      const sidebar = this.querySelector('[slot="sidebar"]');
      if (sidebar?.contains(this.ownerDocument.activeElement)) {
        this.shadowRoot?.querySelector<HTMLButtonElement>('.sidebar-toggle')?.focus();
      }
    }
  }

  private handleSidebarSlot(event: Event) {
    this.hasSidebar = (event.currentTarget as HTMLSlotElement).assignedElements().length > 0;
  }

  private toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.emit<{ collapsed: boolean }>('ds-sidebar-toggle', { collapsed: this.sidebarCollapsed });
  }

  private handleHeaderSlot(event: Event) {
    this.hasHeader = (event.currentTarget as HTMLSlotElement).assignedElements().length > 0;
  }

  protected override render() {
    return html`<aside
        id="sidebar"
        class="sidebar"
        part="sidebar"
        ?inert=${this.sidebarCollapsed}
        aria-hidden=${this.sidebarCollapsed ? 'true' : nothing}
      >
        <slot name="sidebar" @slotchange=${this.handleSidebarSlot}></slot>
      </aside>
      <section class="workspace">
        <header class="header" part="header" ?hidden=${!this.hasHeader && !this.hasSidebar}>
          ${
            this.hasSidebar
              ? html`<button
                  class="sidebar-toggle"
                  part="sidebar-toggle"
                  type="button"
                  aria-label=${this.sidebarCollapsed ? this.expandSidebarLabel : this.collapseSidebarLabel}
                  title=${this.sidebarCollapsed ? this.expandSidebarLabel : this.collapseSidebarLabel}
                  aria-expanded=${String(!this.sidebarCollapsed)}
                  aria-controls="sidebar"
                  @click=${this.toggleSidebar}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <path d="M9 4v16"></path>
                    <path d=${this.sidebarCollapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'}></path>
                  </svg>
                </button>`
              : nothing
          }
          <slot name="header" @slotchange=${this.handleHeaderSlot}></slot>
        </header>
        <div class="workspace-body" part="workspace">
          <main class="main" part="main"><slot></slot></main>
          <slot name="inspector"></slot>
        </div>
      </section>`;
  }
}
