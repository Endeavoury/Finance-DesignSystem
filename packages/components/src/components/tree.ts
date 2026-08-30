import { css, html, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { foundationStyles } from '@endeavoury/finance-design-styles';
import { DsElement } from '../core/ds-element.js';

export interface DsTreeActivateDetail { value: string; }

export class DsTree extends DsElement {
  static override styles: CSSResultGroup = [foundationStyles, css`
    :host { display: block; }
    [role='tree'] { display: grid; gap: var(--ds-space-1); }
  `];
  @property() label = 'Navigation tree';
  protected override render() {
    return html`<div role="tree" aria-label=${this.label} part="tree"><slot></slot></div>`;
  }
}

export class DsTreeItem extends DsElement {
  static override styles: CSSResultGroup = [foundationStyles, css`
    :host { display: block; min-width: 0; }
    .row { display: flex; align-items: center; min-height: 2.5rem; border-radius: var(--ds-radius-md); }
    button, a { display: flex; align-items: center; gap: var(--ds-space-2); width: 100%; min-height: 2.5rem; padding: var(--ds-space-2) var(--ds-space-3); border: 0; border-radius: inherit; background: transparent; color: var(--ds-color-text-secondary); font: inherit; font-weight: var(--ds-font-weight-medium); text-align: start; text-decoration: none; cursor: pointer; }
    button:hover, a:hover { background: var(--ds-color-bg-hover); color: var(--ds-color-text-primary); }
    button:focus-visible, a:focus-visible { outline: 2px solid var(--ds-color-focus); outline-offset: 2px; }
    :host([active]) .row { background: var(--ds-color-accent-soft); }
    :host([active]) button, :host([active]) a { color: var(--ds-color-accent-primary); }
    :host([disabled]) { opacity: .55; pointer-events: none; }
    .indicator { display: inline-grid; width: 1rem; place-items: center; transition: transform var(--ds-duration-fast) var(--ds-ease-standard); }
    :host([expanded]) .indicator { transform: rotate(90deg); }
    .indicator.empty { visibility: hidden; }
    .children { display: grid; gap: var(--ds-space-1); margin-inline-start: var(--ds-space-5); padding-inline-start: var(--ds-space-2); border-inline-start: 1px solid var(--ds-color-border-subtle); }
    .children[hidden] { display: none; }
    ::slotted(a) { display: flex; min-height: 2.25rem; align-items: center; padding-inline: var(--ds-space-3); border-radius: var(--ds-radius-md); color: var(--ds-color-text-secondary); font-size: var(--ds-font-size-sm); text-decoration: none; }
    ::slotted(a:hover) { background: var(--ds-color-bg-hover); color: var(--ds-color-text-primary); }
    ::slotted(a.active) { background: var(--ds-color-accent-soft); color: var(--ds-color-accent-primary); }
  `];
  @property() label = '';
  @property() value = '';
  @property() href = '';
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @state() private hasChildren = false;

  private syncChildren(event: Event): void {
    this.hasChildren = (event.currentTarget as HTMLSlotElement).assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()));
  }
  private activate(event: Event): void {
    if (this.disabled) { event.preventDefault(); return; }
    if (this.hasChildren && !this.href) this.expanded = !this.expanded;
    this.emit<DsTreeActivateDetail>('ds-tree-activate', { value: this.value });
  }
  private keydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' && this.hasChildren && !this.expanded) { event.preventDefault(); this.expanded = true; }
    if (event.key === 'ArrowLeft' && this.expanded) { event.preventDefault(); this.expanded = false; }
  }
  protected override render() {
    const content = html`<span class=${`indicator ${this.hasChildren ? '' : 'empty'}`} aria-hidden="true">›</span><slot name="icon"></slot><span>${this.label || html`<slot name="label"></slot>`}</span>`;
    return html`<div role="treeitem" aria-expanded=${this.hasChildren ? String(this.expanded) : undefined} aria-selected=${String(this.active)} part="item" @keydown=${this.keydown}>
      <div class="row" part="row">${this.href ? html`<a href=${this.href} @click=${this.activate}>${content}</a>` : html`<button type="button" ?disabled=${this.disabled} @click=${this.activate}>${content}</button>`}</div>
      <div class="children" role="group" part="children" ?hidden=${!this.expanded}><slot @slotchange=${this.syncChildren}></slot></div>
    </div>`;
  }
}
