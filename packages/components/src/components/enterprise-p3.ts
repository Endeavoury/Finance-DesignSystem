import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, mediaCompact } from '@endeavoury/kanosis-styles';
import { DsElement } from '../core/ds-element.js';

export interface DsAuditEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  time?: string;
  detail?: string;
}
export interface DsPermissionRole {
  id: string;
  label: string;
}
export interface DsPermission {
  id: string;
  label: string;
  description?: string;
}
export interface DsDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}
export interface DsTourStep {
  id: string;
  heading: string;
  body: string;
}

const p3Base = css`
  :host {
    display: block;
    min-width: 0;
  }
  .surface {
    min-width: 0;
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
    box-shadow: var(--ds-shadow-panel);
  }
  button,
  input,
  textarea,
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
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--ds-color-focus);
    outline-offset: 2px;
  }
  .muted {
    color: var(--ds-color-text-muted);
    font-size: var(--ds-font-size-sm);
  }
`;

export class DsAuditLog extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: var(--ds-space-3) var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      td small {
        display: block;
        color: var(--ds-color-text-muted);
      }
    `,
  ];
  @property({ attribute: false }) entries: DsAuditEntry[] = [];
  protected override render() {
    return html`<table class="surface" aria-label="Audit log">
      <thead>
        <tr>
          <th>Actor</th>
          <th>Action</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${this.entries.map(
          (entry) =>
            html`<tr>
              <td>
                <strong>${entry.actor}</strong
                >${entry.target ? html`<small>${entry.target}</small>` : nothing}
              </td>
              <td>
                ${entry.action}${entry.detail ? html`<small>${entry.detail}</small>` : nothing}
              </td>
              <td>${entry.time ?? '—'}</td>
            </tr>`,
        )}
      </tbody>
    </table>`;
  }
}

export class DsPermissionMatrix extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .frame {
        overflow: auto;
      }
      table {
        width: 100%;
        min-width: 36rem;
        border-collapse: collapse;
      }
      th,
      td {
        padding: var(--ds-space-3);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        text-align: center;
      }
      th:first-child,
      td:first-child {
        position: sticky;
        left: 0;
        text-align: left;
        background: var(--ds-color-bg-surface);
      }
      th {
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
      input {
        accent-color: var(--ds-color-accent-primary);
      }
    `,
  ];
  @property({ attribute: false }) roles: DsPermissionRole[] = [];
  @property({ attribute: false }) permissions: DsPermission[] = [];
  @property({ attribute: false }) value: Record<string, boolean> = {};
  private toggle(role: string, permission: string, checked: boolean) {
    this.value = { ...this.value, [`${role}:${permission}`]: checked };
    this.emit<Record<string, boolean>>('ds-permission-change', this.value);
  }
  protected override render() {
    return html`<div class="frame surface">
      <table aria-label="Permissions">
        <thead>
          <tr>
            <th>Permission</th>
            ${this.roles.map((role) => html`<th>${role.label}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${this.permissions.map(
            (permission) =>
              html`<tr>
                <th scope="row">${permission.label}</th>
                ${this.roles.map((role) => html`<td><input type="checkbox" aria-label=${`${role.label}: ${permission.label}`} .checked=${this.value[`${role.id}:${permission.id}`] ?? false} @change=${(event: Event) => this.toggle(role.id, permission.id, (event.target as HTMLInputElement).checked)} /></td>`)}
              </tr>`,
          )}
        </tbody>
      </table>
    </div>`;
  }
}

export class DsRoleBadge extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        min-height: 1.5rem;
        padding: 0 0.55rem;
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
      }
      :host([tone='admin']) .badge {
        background: var(--ds-color-accent-soft);
        color: var(--ds-color-accent-hover);
      }
      :host([tone='danger']) .badge {
        background: var(--ds-color-danger-soft);
        color: var(--ds-color-danger);
      }
    `,
  ];
  @property() label = 'Member';
  @property({ reflect: true }) tone: 'neutral' | 'admin' | 'danger' = 'neutral';
  protected override render() {
    return html`<span class="badge">${this.label}</span>`;
  }
}

export class DsDiffViewer extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      pre {
        margin: 0;
        padding: var(--ds-space-4);
        overflow: auto;
        font-family: var(--ds-font-mono);
        font-size: var(--ds-font-size-sm);
        line-height: 1.7;
      }
      .line {
        display: block;
        padding: 0 var(--ds-space-2);
        white-space: pre;
      }
      .line[data-added] {
        background: var(--ds-color-success-soft);
        color: var(--ds-color-success);
      }
      .line[data-removed] {
        background: var(--ds-color-danger-soft);
        color: var(--ds-color-danger);
      }
    `,
  ];
  @property({ attribute: false }) lines: DsDiffLine[] = [];
  protected override render() {
    return html`<pre class="surface" aria-label="Difference">
${this.lines.map((line) => html`<span class="line" ?data-added=${line.type === 'added'} ?data-removed=${line.type === 'removed'}>${line.type === 'added' ? '＋' : line.type === 'removed' ? '－' : ' '} ${line.text}</span>`)}</pre>`;
  }
}

export class DsCodeEditor extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      label {
        display: grid;
        gap: 0.35rem;
      }
      textarea {
        width: 100%;
        min-height: 14rem;
        padding: var(--ds-space-4);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-sunken);
        color: var(--ds-color-text-primary);
        font: var(--ds-font-size-sm)/1.6 var(--ds-font-mono);
        resize: vertical;
        tab-size: 2;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--ds-space-2);
      }
    `,
  ];
  @property() label = 'Code';
  @property() value = '';
  @property() language = 'text';
  private input(event: Event) {
    this.value = (event.target as HTMLTextAreaElement).value;
    this.emit<{ value: string }>('ds-input', { value: this.value });
  }
  protected override render() {
    return html`<label
      ><span>${this.label}</span
      ><textarea
        spellcheck="false"
        aria-label=${this.label}
        .value=${this.value}
        @input=${this.input}
      ></textarea
      ><span class="footer"
        ><span class="muted">${this.language}</span
        ><span class="muted">${this.value.length} characters</span></span
      ></label
    >`;
  }
}

export class DsJsonEditor extends DsCodeEditor {
  @property() invalidMessage = '';
  protected override render() {
    let invalid = this.invalidMessage;
    try {
      if (this.value.trim()) JSON.parse(this.value);
    } catch {
      invalid = invalid || 'Invalid JSON';
    }
    return html`${super.render()}${invalid ? html`<p role="alert" style="color:var(--ds-color-danger);font-size:var(--ds-font-size-sm)">${invalid}</p>` : nothing}`;
  }
}

export class DsMaintenanceNotice extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .notice {
        display: flex;
        align-items: flex-start;
        gap: var(--ds-space-3);
        padding: var(--ds-space-4);
        border-color: var(--ds-color-warning);
        background: var(--ds-color-warning-soft);
      }
      .icon {
        font-size: 1.25rem;
      }
      h2 {
        margin: 0;
        font-size: var(--ds-font-size-lg);
      }
      p {
        margin: 0.25rem 0 0;
        color: var(--ds-color-text-secondary);
      }
    `,
  ];
  @property() heading = 'Scheduled maintenance';
  @property() message = 'Some features may be temporarily unavailable.';
  @property() until = '';
  protected override render() {
    return html`<aside class="notice surface" role="status">
      <span class="icon" aria-hidden="true">⚠</span>
      <div>
        <h2>${this.heading}</h2>
        <p>
          ${this.message}${this.until ? html` <strong>Expected ${this.until}.</strong>` : nothing}
        </p>
      </div>
    </aside>`;
  }
}

export class DsHelpPanel extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .panel {
        padding: var(--ds-space-5);
      }
      h2 {
        margin: 0 0 var(--ds-space-2);
        font-size: var(--ds-font-size-lg);
      }
      .body {
        color: var(--ds-color-text-secondary);
      }
      .links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ds-space-2);
        margin-top: var(--ds-space-4);
      }
    `,
  ];
  @property() heading = 'Need help?';
  @property() description = 'Find answers and guidance for this workspace.';
  protected override render() {
    return html`<aside class="panel surface">
      <h2>${this.heading}</h2>
      <p class="body">${this.description}</p>
      <div class="links"><slot name="links"></slot></div>
      <slot></slot>
    </aside>`;
  }
}

export class DsTour extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .tour {
        padding: var(--ds-space-5);
      }
      h2 {
        margin: 0;
        font-size: var(--ds-font-size-xl);
      }
      p {
        color: var(--ds-color-text-secondary);
      }
      .footer {
        display: flex;
        justify-content: space-between;
        gap: var(--ds-space-2);
        margin-top: var(--ds-space-5);
      }
    `,
  ];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: false }) steps: DsTourStep[] = [];
  @property({ type: Number }) index = 0;
  private move(delta: number) {
    this.index = Math.min(Math.max(0, this.index + delta), Math.max(0, this.steps.length - 1));
    this.emit<{ index: number }>('ds-tour-change', { index: this.index });
  }
  protected override render() {
    const step = this.steps[this.index];
    return step
      ? html`<section class="tour surface" role="dialog" aria-label="Product tour">
          <span class="muted">Step ${this.index + 1} of ${this.steps.length}</span>
          <h2>${step.heading}</h2>
          <p>${step.body}</p>
          <div class="footer">
            <button type="button" @click=${() => (this.open = false)}>Skip</button
            ><span
              ><button type="button" ?disabled=${this.index === 0} @click=${() => this.move(-1)}>
                Back
              </button>
              <button
                type="button"
                @click=${() => (this.index === this.steps.length - 1 ? (this.open = false) : this.move(1))}
              >
                ${this.index === this.steps.length - 1 ? 'Finish' : 'Next'}
              </button></span
            >
          </div>
        </section>`
      : nothing;
  }
}

export class DsCoachmark extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .mark {
        position: relative;
        padding: var(--ds-space-4);
      }
      .arrow {
        position: absolute;
        top: -0.4rem;
        left: 1.5rem;
        width: 0.8rem;
        height: 0.8rem;
        transform: rotate(45deg);
        border-top: 1px solid var(--ds-color-border-default);
        border-left: 1px solid var(--ds-color-border-default);
        background: var(--ds-color-bg-surface);
      }
      h2 {
        margin: 0 0 0.25rem;
        font-size: var(--ds-font-size-md);
      }
      p {
        margin: 0;
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property() heading = 'Tip';
  @property() message = 'Here is something useful to know.';
  protected override render() {
    return html`<aside class="mark surface" role="note">
      <span class="arrow" aria-hidden="true"></span>
      <h2>${this.heading}</h2>
      <p>${this.message}</p>
      <slot></slot>
    </aside>`;
  }
}

export class DsCompareView extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p3Base,
    css`
      .compare {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: hidden;
      }
      .column {
        min-width: 0;
      }
      .heading {
        padding: var(--ds-space-3) var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        font-weight: var(--ds-font-weight-semibold);
      }
      .content {
        min-height: 4rem;
        padding: var(--ds-space-4);
        overflow: auto;
      }
      .column + .column {
        border-left: 1px solid var(--ds-color-border-default);
      }
      @media ${mediaCompact} {
        .compare {
          grid-template-columns: 1fr;
        }
        .column + .column {
          border-top: 1px solid var(--ds-color-border-default);
          border-left: 0;
        }
      }
    `,
  ];
  @property() leftLabel = 'Before';
  @property() rightLabel = 'After';
  protected override render() {
    return html`<section class="compare surface">
      <div class="column">
        <div class="heading">${this.leftLabel}</div>
        <div class="content"><slot name="left"></slot></div>
      </div>
      <div class="column">
        <div class="heading">${this.rightLabel}</div>
        <div class="content"><slot name="right"></slot></div>
      </div>
    </section>`;
  }
}
