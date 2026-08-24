import { css, html, nothing, type CSSResultGroup, type PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { foundationStyles } from '@endeavoury/finance-design-styles';
import { DsElement } from '../core/ds-element.js';

const gaps = css`
  :host([gap='0']) {
    --gap: var(--ds-space-0);
  }
  :host([gap='1']) {
    --gap: var(--ds-space-1);
  }
  :host([gap='2']) {
    --gap: var(--ds-space-2);
  }
  :host([gap='3']) {
    --gap: var(--ds-space-3);
  }
  :host([gap='4']) {
    --gap: var(--ds-space-4);
  }
  :host([gap='5']) {
    --gap: var(--ds-space-5);
  }
  :host([gap='6']) {
    --gap: var(--ds-space-6);
  }
  :host([gap='8']) {
    --gap: var(--ds-space-8);
  }
`;
export class DsStack extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--gap, var(--ds-space-4));
      }
      :host([align='start']) {
        align-items: flex-start;
      }
      :host([align='center']) {
        align-items: center;
      }
      :host([align='end']) {
        align-items: flex-end;
      }
      :host([align='stretch']) {
        align-items: stretch;
      }
    `,
  ];
  @property({ reflect: true }) gap = '4';
  @property({ reflect: true }) align: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsInline extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: var(--gap, var(--ds-space-3));
        flex-wrap: wrap;
      }
      :host([align='start']) {
        align-items: flex-start;
      }
      :host([align='end']) {
        align-items: flex-end;
      }
      :host([justify='start']) {
        justify-content: flex-start;
      }
      :host([justify='center']) {
        justify-content: center;
      }
      :host([justify='end']) {
        justify-content: flex-end;
      }
      :host([justify='between']) {
        justify-content: space-between;
      }
      :host([wrap='false']) {
        flex-wrap: nowrap;
      }
    `,
  ];
  @property({ reflect: true }) gap = '3';
  @property({ reflect: true }) align: 'start' | 'center' | 'end' = 'center';
  @property({ reflect: true }) justify: 'start' | 'center' | 'end' | 'between' = 'start';
  @property({ type: Boolean, reflect: true }) wrap = true;
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsGrid extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: grid;
        grid-template-columns: repeat(var(--columns, 3), minmax(0, 1fr));
        gap: var(--gap, var(--ds-space-4));
      }
      :host([columns='1']) {
        --columns: 1;
      }
      :host([columns='2']) {
        --columns: 2;
      }
      :host([columns='3']) {
        --columns: 3;
      }
      :host([columns='4']) {
        --columns: 4;
      }
      :host([columns='6']) {
        --columns: 6;
      }
      @media (max-width: 900px) {
        :host([responsive]) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 600px) {
        :host([responsive]) {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
  @property({ reflect: true }) columns = '3';
  @property({ reflect: true }) gap = '4';
  @property({ type: Boolean, reflect: true }) responsive = true;
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsContainer extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        width: min(100% - 2.5rem, var(--container, 92rem));
        margin-inline: auto;
      }
      :host([size='narrow']) {
        --container: 48rem;
      }
      :host([size='wide']) {
        --container: 108rem;
      }
      :host([flush]) {
        width: 100%;
      }
    `,
  ];
  @property({ reflect: true }) size: 'narrow' | 'normal' | 'wide' = 'normal';
  @property({ type: Boolean, reflect: true }) flush = false;
  protected override render() {
    return html`<slot></slot>`;
  }
}

export class DsPageHeader extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-6);
        padding: var(--ds-space-2) 0 var(--ds-space-5);
      }
      .copy {
        min-width: 0;
      }
      h1 {
        margin: 0.375rem 0 0;
        font-size: clamp(var(--ds-font-size-2xl), 2.3vw, var(--ds-font-size-3xl));
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: var(--ds-letter-spacing-tight);
        line-height: var(--ds-line-height-tight);
      }
      p {
        max-width: 48rem;
        margin: 0.4375rem 0 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-md);
      }
      .actions {
        flex: 0 0 auto;
      }
      @media (max-width: 640px) {
        .header {
          display: grid;
          align-items: start;
        }
        .actions {
          width: 100%;
        }
      }
    `,
  ];
  @property() eyebrow = '';
  @property() heading = '';
  @property() description = '';
  protected override render() {
    return html`<header class="header" part="header">
      <div class="copy">
        <p class="eyebrow">${this.eyebrow}</p>
        <h1 part="heading">${this.heading}</h1>
        <p part="description">${this.description}</p>
      </div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </header>`;
  }
}

export class DsDetailSidebar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        position: fixed;
        z-index: var(--ds-z-overlay);
        inset: 0;
        display: block;
        visibility: hidden;
        pointer-events: none;
        transition: visibility 0s linear var(--ds-duration-normal);
      }
      :host([open]) {
        visibility: visible;
        transition-delay: 0s;
      }
      :host([open][modal]) {
        pointer-events: auto;
      }
      .backdrop {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        border: 0;
        background: color-mix(in srgb, var(--ds-color-bg-sunken) 38%, transparent);
        opacity: 0;
        pointer-events: none;
        cursor: default;
        transition: opacity var(--ds-duration-normal) var(--ds-ease-standard);
      }
      :host([open][modal]) .backdrop {
        opacity: 1;
        pointer-events: auto;
      }
      aside {
        position: absolute;
        inset: 0 0 0 auto;
        display: grid;
        grid-template-rows: auto auto minmax(0, 1fr) auto;
        width: min(var(--ds-detail-sidebar-width, 30rem), 100%);
        border-left: 1px solid var(--ds-color-border-default);
        outline: 0;
        background: var(--ds-color-bg-surface);
        box-shadow: var(--ds-shadow-lg);
        color: var(--ds-color-text-primary);
        pointer-events: auto;
        transform: translateX(100%);
        transition: transform var(--ds-duration-normal) var(--ds-ease-standard);
      }
      :host([open]) aside {
        transform: translateX(0);
      }
      header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--ds-space-4);
        padding: var(--ds-space-6);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      h2 {
        margin: 0;
        font-size: var(--ds-font-size-xl);
        line-height: var(--ds-line-height-tight);
      }
      .close {
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        width: 2.25rem;
        height: 2.25rem;
        padding: 0;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-muted);
        font: inherit;
        font-size: 1.375rem;
        line-height: 1;
        cursor: pointer;
      }
      .close:hover {
        border-color: var(--ds-color-border-strong);
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      .summary {
        padding: var(--ds-space-5) var(--ds-space-6);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        background: var(--ds-color-bg-surface-subtle);
      }
      .content {
        min-height: 0;
        padding: var(--ds-space-5) var(--ds-space-6);
        overflow: auto;
        overscroll-behavior: contain;
      }
      footer {
        padding: var(--ds-space-4) var(--ds-space-6);
        border-top: 1px solid var(--ds-color-border-subtle);
        background: var(--ds-color-bg-surface-subtle);
      }
      @media (max-width: 640px) {
        aside {
          width: 100%;
        }
        header,
        .summary,
        .content,
        footer {
          padding-inline: var(--ds-space-4);
        }
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) modal = false;
  @property() heading = 'Details';
  @property({ attribute: 'close-label' }) closeLabel = 'Close details';
  @query('aside') private panel!: HTMLElement;
  private returnFocus: HTMLElement | null = null;

  protected override updated(changed: PropertyValues<this>) {
    if (!changed.has('open')) return;
    if (this.open) {
      this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      this.panel.focus({ preventScroll: true });
    } else {
      this.returnFocus?.focus({ preventScroll: true });
      this.returnFocus = null;
    }
  }

  private close() {
    this.emit<void>('ds-close', undefined);
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.close();
  }

  protected override render() {
    return html`<div aria-hidden=${this.open ? 'false' : 'true'} @keydown=${this.handleKeydown}>
      <button class="backdrop" type="button" tabindex="-1" aria-label=${this.closeLabel} @click=${this.close}></button>
      <aside
        part="panel"
        role=${this.modal ? 'dialog' : 'complementary'}
        aria-modal=${this.modal ? 'true' : nothing}
        aria-labelledby=${this.heading ? 'detail-sidebar-title' : nothing}
        aria-label=${this.heading ? nothing : 'Details'}
        tabindex="-1"
      >
        <header part="header">
          <h2 id="detail-sidebar-title" part="heading">${this.heading}</h2>
          <button class="close" part="close-button" type="button" aria-label=${this.closeLabel} @click=${this.close}>×</button>
        </header>
        <section class="summary" part="summary"><slot name="summary"></slot></section>
        <section class="content" part="content"><slot></slot></section>
        <footer part="footer"><slot name="footer"></slot></footer>
      </aside>
    </div>`;
  }
}
