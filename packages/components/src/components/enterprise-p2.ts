import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles } from '@endeavoury/kanosis-styles';
import { DsElement } from '../core/ds-element.js';
import { DsDropZone } from './upload.js';
import { DsProgress } from './feedback.js';

export interface DsFieldItem {
  id: string;
  label: string;
  value?: string;
}
export interface DsStep {
  id: string;
  label: string;
  description?: string;
}
export interface DsTask {
  id: string;
  title: string;
  detail?: string;
  completed?: boolean;
}
export interface DsTimelineItem {
  title: string;
  body?: string;
  time?: string;
  tone?: string;
}
export interface DsActivityItem {
  id: string;
  actor: string;
  body: string;
  time?: string;
}
export interface DsChangeItem {
  field: string;
  before: string;
  after: string;
}

const p2Base = css`
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

export class DsFormSection extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      section {
        padding: var(--ds-space-5);
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: var(--ds-space-3);
        margin-bottom: var(--ds-space-4);
      }
      h2 {
        margin: 0;
        font-size: var(--ds-font-size-lg);
      }
      .description {
        margin: 0.25rem 0 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(var(--columns, 2), minmax(0, 1fr));
        gap: var(--ds-space-4);
      }
      @media (max-width: 640px) {
        .fields {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
  @property() heading = '';
  @property() description = '';
  @property({ type: Number }) columns = 2;
  protected override updated() {
    this.style.setProperty('--columns', String(Math.max(1, Math.min(4, this.columns))));
  }
  protected override render() {
    return html`<section class="surface">
      <header>
        <div>
          <h2>${this.heading}</h2>
          ${this.description ? html`<p class="description">${this.description}</p>` : nothing}
        </div>
        <slot name="actions"></slot>
      </header>
      <div class="fields"><slot></slot></div>
    </section>`;
  }
}

export class DsFieldArray extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      .array {
        display: grid;
        gap: var(--ds-space-3);
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--ds-space-2);
        align-items: end;
        padding: var(--ds-space-3);
        border: 1px solid var(--ds-color-border-subtle);
        border-radius: var(--ds-radius-md);
      }
      label {
        display: grid;
        gap: 0.25rem;
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
      }
      input {
        min-height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--ds-space-3);
      }
    `,
  ];
  @property({ attribute: false }) items: DsFieldItem[] = [];
  @property() label = 'Items';
  @property() addLabel = 'Add item';
  private add() {
    this.items = [...this.items, { id: `item-${Date.now()}`, label: '', value: '' }];
    this.emit<DsFieldItem[]>('ds-items-change', this.items);
  }
  private removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.emit<DsFieldItem[]>('ds-items-change', this.items);
  }
  private change(id: string, value: string) {
    this.items = this.items.map((item) => (item.id === id ? { ...item, value } : item));
    this.emit<DsFieldItem[]>('ds-items-change', this.items);
  }
  protected override render() {
    return html`<section class="array" aria-label=${this.label}>
      ${this.items.map(
        (item) =>
          html`<div class="row">
            <label
              >${item.label || 'Value'}<input
                .value=${item.value ?? ''}
                @input=${(event: Event) => this.change(item.id, (event.target as HTMLInputElement).value)} /></label
            ><button
              type="button"
              aria-label="Remove item"
              @click=${() => this.removeItem(item.id)}
            >
              ×
            </button>
          </div>`,
      )}
      <div class="footer">
        <span class="muted">${this.items.length} item${this.items.length === 1 ? '' : 's'}</span
        ><button type="button" @click=${this.add}>${this.addLabel}</button>
      </div>
    </section>`;
  }
}

export class DsDatePicker extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      label {
        display: grid;
        gap: 0.25rem;
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
      }
      input {
        min-height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
    `,
  ];
  @property() label = 'Date';
  @property() value = '';
  @property() min = '';
  @property() max = '';
  private change(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.emit<{ value: string }>('ds-change', { value: this.value });
  }
  protected override render() {
    return html`<label
      >${this.label}<input
        type="date"
        .value=${this.value}
        min=${this.min || nothing}
        max=${this.max || nothing}
        @change=${this.change}
    /></label>`;
  }
}

export class DsTimePicker extends DsDatePicker {
  protected override render() {
    return html`<label
      >${this.label}<input
        type="time"
        .value=${this.value}
        @change=${(event: Event) => {
          this.value = (event.target as HTMLInputElement).value;
          this.emit<{ value: string }>('ds-change', { value: this.value });
        }}
    /></label>`;
  }
}

export class DsFileUpload extends DsDropZone {}

export class DsStepper extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      ol {
        display: flex;
        gap: var(--ds-space-2);
        margin: 0;
        padding: 0;
        list-style: none;
        overflow: auto;
      }
      li {
        display: flex;
        align-items: center;
        gap: var(--ds-space-2);
        min-width: max-content;
        color: var(--ds-color-text-muted);
      }
      li::after {
        content: '›';
        color: var(--ds-color-border-strong);
      }
      li:last-child::after {
        display: none;
      }
      button {
        border: 0;
        background: transparent;
        color: inherit;
      }
      li[data-active] {
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
      }
      .number {
        display: grid;
        place-items: center;
        width: 1.75rem;
        height: 1.75rem;
        border: 1px solid currentColor;
        border-radius: 50%;
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property({ attribute: false }) steps: DsStep[] = [];
  @property() value = '';
  private select(id: string) {
    this.value = id;
    this.emit<{ id: string }>('ds-step-change', { id });
  }
  protected override render() {
    return html`<nav aria-label="Progress">
      <ol>
        ${this.steps.map(
          (step, index) =>
            html`<li ?data-active=${step.id === this.value}>
              <button type="button" @click=${() => this.select(step.id)}>
                <span class="number">${index + 1}</span>${step.label}
              </button>
            </li>`,
        )}
      </ol>
    </nav>`;
  }
}

export class DsApprovalFlow extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      .flow {
        display: flex;
        align-items: center;
        gap: var(--ds-space-2);
        padding: var(--ds-space-4);
      }
      .state {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .state[data-current] {
        color: var(--ds-color-text-primary);
        font-weight: var(--ds-font-weight-semibold);
      }
      .dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: currentColor;
      }
      .connector {
        flex: 1;
        height: 1px;
        background: var(--ds-color-border-default);
      }
    `,
  ];
  @property() status: 'draft' | 'pending' | 'approved' | 'rejected' = 'draft';
  private readonly states = ['draft', 'pending', 'approved'];
  protected override render() {
    const current = this.status === 'rejected' ? 1 : this.states.indexOf(this.status);
    return html`<div class="flow surface" aria-label="Approval status">
      ${this.states.map((state, index) => html`<span class="state" ?data-current=${index === current}><span class="dot"></span>${state}</span>${index < this.states.length - 1 ? html`<span class="connector"></span>` : nothing}`)}${this.status === 'rejected' ? html`<span class="state" data-current><span class="dot"></span>rejected</span>` : nothing}
    </div>`;
  }
}

export class DsTaskList extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      ul {
        display: grid;
        gap: var(--ds-space-1);
        margin: 0;
        padding: var(--ds-space-2);
        list-style: none;
      }
      li {
        display: flex;
        gap: var(--ds-space-3);
        padding: var(--ds-space-3);
        border-radius: var(--ds-radius-md);
      }
      li:hover {
        background: var(--ds-color-bg-hover);
      }
      .copy {
        min-width: 0;
      }
      .detail {
        display: block;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      li[data-completed] strong {
        text-decoration: line-through;
        color: var(--ds-color-text-muted);
      }
      input {
        accent-color: var(--ds-color-accent-primary);
      }
    `,
  ];
  @property({ attribute: false }) tasks: DsTask[] = [];
  private toggle(id: string) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    this.emit<DsTask[]>('ds-task-change', this.tasks);
  }
  protected override render() {
    return html`<ul class="surface" aria-label="Tasks">
      ${this.tasks.map(
        (task) =>
          html`<li ?data-completed=${task.completed}>
            <input
              type="checkbox"
              .checked=${task.completed ?? false}
              aria-label=${`Complete ${task.title}`}
              @change=${() => this.toggle(task.id)}
            /><span class="copy"
              ><strong>${task.title}</strong
              >${task.detail ? html`<span class="detail">${task.detail}</span>` : nothing}</span
            >
          </li>`,
      )}
    </ul>`;
  }
}

export class DsTimeline extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      ol {
        margin: 0;
        padding: var(--ds-space-4);
        list-style: none;
      }
      li {
        position: relative;
        display: grid;
        grid-template-columns: 1rem minmax(0, 1fr);
        gap: var(--ds-space-3);
        padding-bottom: var(--ds-space-5);
      }
      li:last-child {
        padding-bottom: 0;
      }
      li::before {
        content: '';
        position: absolute;
        top: 0.7rem;
        bottom: -0.25rem;
        left: 0.28rem;
        width: 1px;
        background: var(--ds-color-border-default);
      }
      li:last-child::before {
        display: none;
      }
      .dot {
        position: relative;
        z-index: 1;
        width: 0.65rem;
        height: 0.65rem;
        margin-top: 0.3rem;
        border-radius: 50%;
        background: var(--ds-color-accent-primary);
        box-shadow: 0 0 0 3px var(--ds-color-bg-surface);
      }
      .time {
        margin-left: 0.5rem;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
      p {
        margin: 0.25rem 0 0;
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property({ attribute: false }) items: DsTimelineItem[] = [];
  protected override render() {
    return html`<ol class="surface">
      ${this.items.map(
        (item) =>
          html`<li>
            <span class="dot"></span>
            <div>
              <strong>${item.title}</strong
              >${item.time ? html`<span class="time">${item.time}</span>` : nothing}${item.body ? html`<p>${item.body}</p>` : nothing}
            </div>
          </li>`,
      )}
    </ol>`;
  }
}

export class DsActivityFeed extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
    css`
      ul {
        display: grid;
        gap: var(--ds-space-2);
        margin: 0;
        padding: var(--ds-space-3);
        list-style: none;
      }
      li {
        padding: var(--ds-space-3);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      li:last-child {
        border-bottom: 0;
      }
      .time {
        margin-left: 0.5rem;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
      p {
        margin: 0.25rem 0 0;
        color: var(--ds-color-text-secondary);
      }
    `,
  ];
  @property({ attribute: false }) items: DsActivityItem[] = [];
  protected override render() {
    return html`<ul class="surface" aria-label="Activity">
      ${this.items.map(
        (item) =>
          html`<li>
            <strong>${item.actor}</strong
            >${item.time ? html`<span class="time">${item.time}</span>` : nothing}
            <p>${item.body}</p>
          </li>`,
      )}
    </ul>`;
  }
}

export class DsJobStatus extends DsProgress {
  @property() status = 'Processing';
  protected override render() {
    return html`<div aria-label=${this.status}>
      <strong>${this.status}</strong>${super.render()}
    </div>`;
  }
}

export class DsChangeSummary extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    p2Base,
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
      .before {
        color: var(--ds-color-danger);
      }
      .after {
        color: var(--ds-color-success);
      }
    `,
  ];
  @property({ attribute: false }) changes: DsChangeItem[] = [];
  protected override render() {
    return html`<table class="surface" aria-label="Changes">
      <thead>
        <tr>
          <th>Field</th>
          <th>Before</th>
          <th>After</th>
        </tr>
      </thead>
      <tbody>
        ${this.changes.map(
          (change) =>
            html`<tr>
              <th scope="row">${change.field}</th>
              <td class="before">${change.before}</td>
              <td class="after">${change.after}</td>
            </tr>`,
        )}
      </tbody>
    </table>`;
  }
}
