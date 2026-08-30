import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, spinnerStyles, surfaceStyles } from '@endeavoury/finance-design-styles';
import { DsElement, type DsTone } from '../core/ds-element.js';

export class DsAlert extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .alert {
        --alert-accent: var(--ds-color-info);
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        align-items: start;
        padding: 0.875rem var(--ds-space-4);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-lg);
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--alert-accent) 8%, transparent),
            transparent 34%
          ),
          var(--ds-gradient-surface, var(--ds-color-bg-surface));
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-md);
        box-shadow:
          inset 3px 0 var(--alert-accent),
          var(--ds-shadow-sm);
      }
      :host([tone='info']) .alert,
      :host([tone='accent']) .alert {
        --alert-accent: var(--ds-color-info);
        border-color: color-mix(in srgb, var(--ds-color-info) 24%, var(--ds-color-border-default));
      }
      :host([tone='success']) .alert {
        --alert-accent: var(--ds-color-success);
        border-color: color-mix(
          in srgb,
          var(--ds-color-success) 24%,
          var(--ds-color-border-default)
        );
      }
      :host([tone='warning']) .alert {
        --alert-accent: var(--ds-color-warning);
        border-color: color-mix(
          in srgb,
          var(--ds-color-warning) 24%,
          var(--ds-color-border-default)
        );
      }
      :host([tone='danger']) .alert {
        --alert-accent: var(--ds-color-danger);
        border-color: color-mix(
          in srgb,
          var(--ds-color-danger) 24%,
          var(--ds-color-border-default)
        );
      }
      .title {
        display: block;
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: -0.01em;
      }
      .message {
        margin-top: var(--ds-space-1);
      }
      button {
        width: 1.75rem;
        height: 1.75rem;
        border: 0;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-secondary);
        cursor: pointer;
      }
      button:hover {
        background: color-mix(in srgb, var(--ds-color-text-primary) 8%, transparent);
      }
    `,
  ];
  @property({ reflect: true }) tone: DsTone = 'info';
  @property() heading = '';
  @property({ type: Boolean }) dismissible = false;
  private dismiss() {
    this.emit('ds-dismiss', {});
    this.remove();
  }
  protected override render() {
    return html`<div
      class="alert"
      part="alert"
      role=${this.tone === 'danger' || this.tone === 'warning' ? 'alert' : 'status'}
    >
      <slot name="icon"></slot>
      <div>
        <span class="title">${this.heading}</span>
        <div class="message"><slot></slot></div>
      </div>
      ${this.dismissible ? html`<button type="button" aria-label="Dismiss" @click=${this.dismiss}>×</button>` : nothing}
    </div>`;
  }
}

export class DsLoadingState extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    spinnerStyles,
    css`
      :host {
        display: block;
      }
      .state {
        display: grid;
        place-items: center;
        gap: var(--ds-space-3);
        min-height: 11rem;
        padding: var(--ds-space-8);
        text-align: center;
        color: var(--ds-color-text-muted);
      }
      .spinner {
        --ds-spinner-size: 1.75rem;
      }
    `,
  ];
  @property() label = 'Loading';
  protected override render() {
    return html`<div class="state surface" part="state" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span><span>${this.label}</span>
    </div>`;
  }
}

export class DsEmptyState extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .state {
        display: grid;
        place-items: center;
        gap: var(--ds-space-2);
        min-height: 12rem;
        padding: var(--ds-space-8);
        border-style: dashed;
        text-align: center;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-elevated, var(--ds-color-bg-hover));
        color: var(--ds-color-accent-hover);
        box-shadow: var(--ds-shadow-control);
      }
      h2 {
        margin: var(--ds-space-2) 0 0;
        font-size: var(--ds-font-size-lg);
        letter-spacing: var(--ds-letter-spacing-tight);
      }
      p {
        max-width: 34rem;
        margin: 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .actions {
        margin-top: var(--ds-space-2);
      }
    `,
  ];
  @property() heading = 'Nothing here yet';
  @property() description = '';
  protected override render() {
    return html`<div class="state surface" part="state">
      <div class="icon" part="icon"><slot name="icon">◇</slot></div>
      <h2>${this.heading}</h2>
      ${this.description ? html`<p>${this.description}</p>` : nothing}
      <div class="actions"><slot name="actions"></slot></div>
    </div>`;
  }
}

export class DsProgress extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .header {
        display: flex;
        justify-content: space-between;
        gap: var(--ds-space-3);
        margin-bottom: var(--ds-space-2);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
      }
      .value {
        color: var(--ds-color-text-muted);
        font-variant-numeric: tabular-nums;
      }
      progress {
        display: block;
        width: 100%;
        height: 0.5rem;
        overflow: hidden;
        border: 0;
        border-radius: var(--ds-radius-round);
        appearance: none;
        background: var(--ds-color-bg-sunken);
      }
      progress::-webkit-progress-bar {
        border-radius: inherit;
        background: var(--ds-color-bg-sunken);
      }
      progress::-webkit-progress-value {
        border-radius: inherit;
        background: var(--progress-color, var(--ds-color-accent-primary));
        transition: width var(--ds-duration-normal) var(--ds-ease-standard);
      }
      progress::-moz-progress-bar {
        border-radius: inherit;
        background: var(--progress-color, var(--ds-color-accent-primary));
      }
      :host([tone='success']) progress {
        --progress-color: var(--ds-color-success);
      }
      :host([tone='warning']) progress {
        --progress-color: var(--ds-color-warning);
      }
      :host([tone='danger']) progress {
        --progress-color: var(--ds-color-danger);
      }
      progress:indeterminate {
        background: linear-gradient(
          90deg,
          var(--ds-color-bg-sunken) 0 25%,
          var(--progress-color, var(--ds-color-accent-primary)) 45% 55%,
          var(--ds-color-bg-sunken) 75% 100%
        );
        background-size: 220% 100%;
        animation: ds-progress 1.4s linear infinite;
      }
      @keyframes ds-progress {
        to {
          background-position: -220% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        progress:indeterminate {
          animation: none;
          background-position: 50% 0;
        }
      }
    `,
  ];

  @property() label = '';
  @property({ type: Number }) value?: number;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean, attribute: 'show-value' }) showValue = false;
  @property({ reflect: true }) tone: 'accent' | 'success' | 'warning' | 'danger' = 'accent';

  private percentage() {
    return Math.round(
      (Math.max(0, Math.min(this.value ?? 0, this.max)) / Math.max(1, this.max)) * 100,
    );
  }

  protected override render() {
    const determinate = this.value !== undefined && Number.isFinite(this.value);
    return html`${
        this.label || this.showValue
          ? html`<div class="header">
              <span>${this.label}</span
              >${this.showValue && determinate ? html`<span class="value">${this.percentage()}%</span>` : nothing}
            </div>`
          : nothing
      }<progress
        part="progress"
        aria-label=${this.label || 'Progress'}
        max=${Math.max(1, this.max)}
        value=${determinate ? Math.max(0, Math.min(this.value!, this.max)) : nothing}
      ></progress>`;
  }
}

export class DsSkeleton extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        width: var(--skeleton-width, 100%);
      }
      .skeleton {
        display: block;
        width: 100%;
        height: var(--skeleton-height, 1rem);
        overflow: hidden;
        border-radius: var(--ds-radius-sm);
        background: linear-gradient(
          100deg,
          var(--ds-color-bg-sunken) 20%,
          var(--ds-color-bg-hover) 38%,
          var(--ds-color-bg-sunken) 56%
        );
        background-size: 220% 100%;
        animation: ds-skeleton 1.5s var(--ds-ease-standard) infinite;
      }
      :host([shape='circle']) {
        width: var(--skeleton-width, 2.5rem);
      }
      :host([shape='circle']) .skeleton {
        height: var(--skeleton-height, var(--skeleton-width, 2.5rem));
        border-radius: 50%;
      }
      :host([shape='rectangle']) .skeleton {
        border-radius: var(--ds-radius-lg);
      }
      @keyframes ds-skeleton {
        to {
          background-position: -220% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton {
          animation: none;
          background-position: 50% 0;
        }
      }
    `,
  ];

  @property({ reflect: true }) shape: 'text' | 'circle' | 'rectangle' = 'text';
  @property() width = '100%';
  @property() height = '1rem';

  protected override updated() {
    this.style.setProperty('--skeleton-width', this.width);
    this.style.setProperty('--skeleton-height', this.height);
  }

  protected override render() {
    return html`<span class="skeleton" part="skeleton" aria-hidden="true"></span>`;
  }
}

export interface DsToastCloseDetail {
  reason: 'dismiss' | 'timeout' | 'programmatic';
}

export class DsToast extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      :host(:not([open])) {
        display: none;
      }
      .toast {
        --toast-accent: var(--ds-color-info);
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--ds-space-3);
        width: min(24rem, calc(100vw - 2rem));
        padding: var(--ds-space-4);
        border: 1px solid var(--ds-color-border-default);
        border-left: 3px solid var(--toast-accent);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-elevated, var(--ds-color-bg-elevated));
        color: var(--ds-color-text-secondary);
        box-shadow: var(--ds-shadow-lg);
      }
      :host([tone='success']) .toast {
        --toast-accent: var(--ds-color-success);
      }
      :host([tone='warning']) .toast {
        --toast-accent: var(--ds-color-warning);
      }
      :host([tone='danger']) .toast {
        --toast-accent: var(--ds-color-danger);
      }
      strong {
        display: block;
        margin-bottom: var(--ds-space-1);
        color: var(--ds-color-text-primary);
        font-size: var(--ds-font-size-md);
      }
      .message {
        font-size: var(--ds-font-size-sm);
      }
      .actions {
        margin-top: var(--ds-space-3);
      }
      button {
        display: grid;
        place-items: center;
        width: 1.75rem;
        height: 1.75rem;
        border: 0;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-muted);
        cursor: pointer;
      }
      button:hover {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
    `,
  ];

  @property({ type: Boolean, reflect: true }) open = true;
  @property({ reflect: true }) tone: DsTone = 'info';
  @property() heading = '';
  @property({ type: Number }) duration = 5000;
  @property({ type: Boolean }) dismissible = true;
  @property({ attribute: 'close-label' }) closeLabel = 'Dismiss notification';
  private timer?: ReturnType<typeof setTimeout>;

  override disconnectedCallback() {
    this.clearTimer();
    super.disconnectedCallback();
  }

  close(reason: DsToastCloseDetail['reason'] = 'programmatic') {
    if (!this.open) return;
    this.open = false;
    this.clearTimer();
    this.emit<DsToastCloseDetail>('ds-toast-close', { reason });
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private schedule() {
    this.clearTimer();
    if (this.open && this.duration > 0)
      this.timer = setTimeout(() => this.close('timeout'), this.duration);
  }

  protected override updated() {
    this.schedule();
  }

  protected override render() {
    const urgent = this.tone === 'danger' || this.tone === 'warning';
    return html`<div
      class="toast"
      part="toast"
      role=${urgent ? 'alert' : 'status'}
      aria-live=${urgent ? 'assertive' : 'polite'}
      @mouseenter=${this.clearTimer}
      @mouseleave=${this.schedule}
    >
      <div>
        ${this.heading ? html`<strong>${this.heading}</strong>` : nothing}
        <div class="message"><slot></slot></div>
        <div class="actions"><slot name="actions"></slot></div>
      </div>
      ${
        this.dismissible
          ? html`<button
              type="button"
              aria-label=${this.closeLabel}
              @click=${() => this.close('dismiss')}
            >
              ×
            </button>`
          : nothing
      }
    </div>`;
  }
}

export class DsToastRegion extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        position: fixed;
        z-index: var(--ds-z-toast);
        top: var(--ds-space-4);
        right: var(--ds-space-4);
        display: grid;
        gap: var(--ds-space-3);
        max-height: calc(100dvh - 2 * var(--ds-space-4));
        overflow: auto;
        pointer-events: none;
      }
      ::slotted(ds-toast) {
        pointer-events: auto;
      }
      :host([position='top-start']) {
        right: auto;
        left: var(--ds-space-4);
      }
      :host([position='bottom-end']) {
        top: auto;
        bottom: var(--ds-space-4);
      }
      :host([position='bottom-start']) {
        top: auto;
        right: auto;
        bottom: var(--ds-space-4);
        left: var(--ds-space-4);
      }
      @media (max-width: 560px) {
        :host,
        :host([position]) {
          top: var(--ds-space-2);
          right: var(--ds-space-2);
          bottom: auto;
          left: var(--ds-space-2);
        }
      }
    `,
  ];

  @property({ reflect: true }) position: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' =
    'top-end';
  @property() label = 'Notifications';

  protected override render() {
    return html`<section part="region" aria-label=${this.label}><slot></slot></section>`;
  }
}
