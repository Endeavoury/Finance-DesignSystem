import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { foundationStyles, controlStyles } from '@endeavoury/kanosis-styles';
import { DsElement } from '../core/ds-element.js';
import { DsDataTable } from './data-table.js';
import type { DsTableColumn } from './data-table.js';

/** Enterprise alias for the accessible, sortable data table foundation. */
export class DsDataGrid extends DsDataTable {}

export interface DsFilterRule {
  field: string;
  operator: string;
  value: string;
}

export interface DsFilterField {
  key: string;
  label: string;
}

const enterpriseSurface = css`
  :host {
    display: block;
    min-width: 0;
  }
  .surface {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-4);
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-lg);
    background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
    box-shadow: var(--ds-shadow-panel);
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
  .muted {
    color: var(--ds-color-text-muted);
    font-size: var(--ds-font-size-sm);
  }
`;

export class DsFilterBuilder extends DsElement {
  static override styles: CSSResultGroup = [foundationStyles, controlStyles, enterpriseSurface];
  @property({ attribute: false }) fields: DsFilterField[] = [];
  @property({ attribute: false }) rules: DsFilterRule[] = [];
  @property({ attribute: false }) operators: string[] = [
    'contains',
    'equals',
    'starts with',
    'is empty',
  ];
  @property() addLabel = 'Add filter';
  @property() clearLabel = 'Clear filters';

  private emitChange() {
    this.emit<DsFilterRule[]>('ds-filter-change', this.rules);
  }
  private updateRule(index: number, patch: Partial<DsFilterRule>) {
    this.rules = this.rules.map((rule, item) => (item === index ? { ...rule, ...patch } : rule));
    this.emitChange();
  }
  private add() {
    const field = this.fields[0]?.key ?? '';
    this.rules = [...this.rules, { field, operator: this.operators[0] ?? 'contains', value: '' }];
    this.emitChange();
  }
  private removeRule(index: number) {
    this.rules = this.rules.filter((_, item) => item !== index);
    this.emitChange();
  }
  private clear() {
    this.rules = [];
    this.emitChange();
  }
  protected override render() {
    return html`<section class="surface" aria-label="Filters">
      <div class="rules">
        ${
          this.rules.length
            ? this.rules.map(
                (rule, index) =>
                  html`<div class="rule">
                    <select
                      aria-label="Filter field"
                      .value=${rule.field}
                      @change=${(event: Event) => this.updateRule(index, { field: (event.target as HTMLSelectElement).value })}
                    >
                      ${this.fields.map((field) => html`<option value=${field.key}>${field.label}</option>`)}
                    </select>
                    <select
                      aria-label="Filter operator"
                      .value=${rule.operator}
                      @change=${(event: Event) => this.updateRule(index, { operator: (event.target as HTMLSelectElement).value })}
                    >
                      ${this.operators.map((operator) => html`<option value=${operator}>${operator}</option>`)}
                    </select>
                    <input
                      aria-label="Filter value"
                      .value=${rule.value}
                      @input=${(event: Event) => this.updateRule(index, { value: (event.target as HTMLInputElement).value })}
                    />
                    <button
                      type="button"
                      aria-label="Remove filter"
                      @click=${() => this.removeRule(index)}
                    >
                      ×
                    </button>
                  </div>`,
              )
            : html`<span class="muted">No filters applied</span>`
        }
      </div>
      <button type="button" @click=${this.add}>${this.addLabel}</button>
      ${this.rules.length ? html`<button type="button" @click=${this.clear}>${this.clearLabel}</button>` : nothing}
    </section>`;
  }
}

export class DsViewToolbar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    enterpriseSurface,
    css`
      .surface {
        flex-wrap: wrap;
      }
      .query {
        min-width: 12rem;
        flex: 1 1 16rem;
      }
      input {
        width: 100%;
        min-height: var(--ds-control-height-sm);
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--ds-space-2);
      }
    `,
  ];
  @property() query = '';
  @property() placeholder = 'Search records';
  @property() label = 'View toolbar';
  private updateQuery(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    this.emit<{ query: string }>('ds-query-change', { query: this.query });
  }
  protected override render() {
    return html`<section class="surface" aria-label=${this.label}>
      <label class="query"
        ><span class="ds-visually-hidden">${this.placeholder}</span
        ><input
          type="search"
          .value=${this.query}
          placeholder=${this.placeholder}
          @input=${this.updateQuery}
      /></label>
      <div class="actions"><slot></slot><slot name="actions"></slot></div>
    </section>`;
  }
}

export interface DsColumnOption {
  key: string;
  label: string;
  visible?: boolean;
}

export class DsColumnManager extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    enterpriseSurface,
    css`
      .surface {
        display: grid;
        gap: var(--ds-space-2);
        align-items: stretch;
      }
      label {
        display: flex;
        align-items: center;
        gap: var(--ds-space-2);
        padding: var(--ds-space-2);
        border-radius: var(--ds-radius-sm);
        cursor: pointer;
      }
      label:hover {
        background: var(--ds-color-bg-hover);
      }
      input {
        accent-color: var(--ds-color-accent-primary);
      }
    `,
  ];
  @property({ attribute: false }) columns: DsColumnOption[] = [];
  @property() label = 'Columns';
  private toggle(key: string, visible: boolean) {
    this.columns = this.columns.map((column) =>
      column.key === key ? { ...column, visible } : column,
    );
    this.emit<DsColumnOption[]>('ds-columns-change', this.columns);
  }
  protected override render() {
    return html`<section class="surface" aria-label=${this.label}>
      ${this.columns.map((column) => html`<label><input type="checkbox" .checked=${column.visible !== false} @change=${(event: Event) => this.toggle(column.key, (event.target as HTMLInputElement).checked)} />${column.label}</label>`)}
    </section>`;
  }
}

export class DsBulkActions extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    enterpriseSurface,
    css`
      .surface {
        justify-content: space-between;
        flex-wrap: wrap;
        background: var(--ds-color-bg-selected);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ds-space-2);
      }
    `,
  ];
  @property({ type: Number }) count = 0;
  @property() selectedLabel = 'selected';
  @property() clearLabel = 'Clear selection';
  protected override render() {
    return html`<section class="surface" aria-live="polite">
      <strong>${this.count} ${this.selectedLabel}</strong>
      <div class="actions">
        <slot></slot
        ><button type="button" @click=${() => this.emit<void>('ds-clear-selection', undefined)}>
          ${this.clearLabel}
        </button>
      </div>
    </section>`;
  }
}

export interface DsSavedViewOption {
  id: string;
  label: string;
}

export class DsSavedView extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    enterpriseSurface,
    css`
      .surface {
        flex-wrap: wrap;
      }
      select {
        min-height: var(--ds-control-height-sm);
        min-width: 12rem;
        padding: 0 var(--ds-space-3);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-primary);
      }
    `,
  ];
  @property({ attribute: false }) views: DsSavedViewOption[] = [];
  @property() current = '';
  @property() saveLabel = 'Save view';
  @property() deleteLabel = 'Delete view';
  private select(event: Event) {
    this.current = (event.target as HTMLSelectElement).value;
    this.emit<{ id: string }>('ds-view-change', { id: this.current });
  }
  protected override render() {
    return html`<section class="surface" aria-label="Saved views">
      <select .value=${this.current} @change=${this.select}>
        <option value="">Choose a view</option>
        ${this.views.map((view) => html`<option value=${view.id}>${view.label}</option>`)}
      </select>
      <button type="button" @click=${() => this.emit<void>('ds-view-save', undefined)}>
        ${this.saveLabel}
      </button>
      ${this.current ? html`<button type="button" @click=${() => this.emit<{ id: string }>('ds-view-delete', { id: this.current })}>${this.deleteLabel}</button>` : nothing}
    </section>`;
  }
}

export interface DsComboOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export class DsCombobox extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    controlStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .field {
        display: grid;
        gap: var(--ds-space-1);
        position: relative;
      }
      .label {
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-semibold);
      }
      input {
        width: 100%;
        height: var(--ds-control-height-md);
        padding: 0 var(--ds-space-3);
      }
      [role='listbox'] {
        position: absolute;
        z-index: var(--ds-z-dropdown);
        inset: 100% 0 auto;
        max-height: 16rem;
        margin-top: var(--ds-space-1);
        overflow-y: auto;
        padding: var(--ds-space-1);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-bg-elevated);
        box-shadow: var(--ds-shadow-md);
      }
      [role='option'] {
        padding: var(--ds-space-2) var(--ds-space-3);
        border-radius: var(--ds-radius-sm);
        cursor: pointer;
      }
      [role='option']:hover,
      [role='option'][aria-selected='true'],
      [role='option'][data-active] {
        background: var(--ds-color-bg-selected);
      }
    `,
  ];
  @property() label = '';
  @property() value = '';
  @property() placeholder = 'Choose an option';
  @property({ attribute: false }) options: DsComboOption[] = [];
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @state() private activeIndex = -1;
  private filtered() {
    const query = this.value.trim().toLocaleLowerCase();
    return this.options.filter(
      (option) => !query || option.label.toLocaleLowerCase().includes(query),
    );
  }
  private inputChanged(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.open = true;
    this.activeIndex = this.filtered().length ? 0 : -1;
    this.emit<{ value: string }>('ds-combobox-input', { value: this.value });
  }
  private keydown(event: KeyboardEvent) {
    const options = this.filtered();
    if (event.key === 'Escape') {
      this.open = false;
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!options.length) return;
      const offset = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex = (this.activeIndex + offset + options.length) % options.length;
      return;
    }
    if (event.key === 'Enter' && this.open && this.activeIndex >= 0) {
      event.preventDefault();
      const option = options[this.activeIndex];
      if (option) this.choose(option);
    }
  }
  private choose(option: DsComboOption) {
    if (option.disabled) return;
    this.value = option.label;
    this.open = false;
    this.emit<{ value: string }>('ds-change', { value: option.value });
  }
  protected override render() {
    const options = this.filtered();
    return html`<label class="field"
      ><span class="label">${this.label}</span
      ><input
        role="combobox"
        aria-expanded=${this.open}
        aria-autocomplete="list"
        aria-activedescendant=${this.activeIndex >= 0 ? `combo-option-${this.activeIndex}` : nothing}
        .value=${this.value}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        @focus=${() => (this.open = true)}
        @input=${this.inputChanged}
        @keydown=${this.keydown}
      />${this.open ? html`<div role="listbox">${options.length ? options.map((option, index) => html`<div id=${`combo-option-${index}`} role="option" aria-selected=${option.label === this.value} ?data-active=${index === this.activeIndex} @mousedown=${(event: Event) => event.preventDefault()} @click=${() => this.choose(option)}>${option.label}</div>`) : html`<span class="muted">No matches</span>`}</div>` : nothing}</label
    >`;
  }
}

export interface DsValidationError {
  id: string;
  message: string;
}

export class DsValidationSummary extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        padding: var(--ds-space-4);
        border: 1px solid var(--ds-color-danger);
        border-radius: var(--ds-radius-md);
        background: var(--ds-color-danger-soft);
        color: var(--ds-color-text-primary);
      }
      h2 {
        margin: 0 0 var(--ds-space-2);
        font-size: var(--ds-font-size-lg);
      }
      ul {
        margin: 0;
        padding-left: var(--ds-space-5);
      }
      a {
        color: inherit;
      }
    `,
  ];
  @property({ attribute: false }) errors: DsValidationError[] = [];
  @property() heading = 'Please correct these errors';
  protected override render() {
    return this.errors.length
      ? html`<section role="alert" aria-labelledby="validation-heading">
          <h2 id="validation-heading">${this.heading}</h2>
          <ul>
            ${this.errors.map((error) => html`<li><a href=${`#${error.id}`}>${error.message}</a></li>`)}
          </ul>
        </section>`
      : nothing;
  }
}

export type DsEnterpriseColumn = DsTableColumn;
