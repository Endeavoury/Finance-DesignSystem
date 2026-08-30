import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property, query } from 'lit/decorators.js';
import { foundationStyles, spinnerStyles } from '@endeavoury/finance-design-styles';
import { DsElement } from '../core/ds-element.js';

export interface DsFilesDetail {
  files: File[];
}

export interface DsFileRejectDetail extends DsFilesDetail {
  reason: 'type' | 'limit';
}

export class DsDropZone extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    spinnerStyles,
    css`
      :host {
        display: block;
      }
      .zone {
        position: relative;
        display: grid;
        place-items: center;
        gap: var(--ds-space-2);
        min-height: 14rem;
        padding: var(--ds-space-8) var(--ds-space-5);
        border: 1px dashed
          color-mix(in srgb, var(--ds-color-info) 42%, var(--ds-color-border-default));
        border-radius: var(--ds-radius-xl);
        background:
          radial-gradient(
            circle at 50% 0,
            color-mix(in srgb, var(--ds-color-info-soft) 68%, transparent),
            transparent 58%
          ),
          var(--ds-color-bg-surface-subtle);
        color: var(--ds-color-text-secondary);
        text-align: center;
        box-shadow: inset 0 1px 0 var(--ds-color-border-highlight);
        cursor: pointer;
        transition:
          background var(--ds-duration-fast) var(--ds-ease-standard),
          border-color var(--ds-duration-fast) var(--ds-ease-standard),
          box-shadow var(--ds-duration-fast) var(--ds-ease-standard),
          transform var(--ds-duration-fast) var(--ds-ease-standard);
      }
      .zone:hover,
      .zone.dragging {
        border-color: var(--ds-color-info);
        background: var(--ds-color-info-soft);
        box-shadow: var(--ds-shadow-md);
        transform: translateY(-1px);
      }
      .zone:focus-within {
        outline: 2px solid color-mix(in srgb, var(--ds-color-focus) 82%, white);
        outline-offset: 3px;
      }
      .zone.disabled {
        cursor: not-allowed;
        opacity: 0.55;
        transform: none;
      }
      .zone.busy {
        cursor: wait;
        transform: none;
      }
      input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }
      .icon {
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border: 1px solid
          color-mix(in srgb, var(--ds-color-info) 18%, var(--ds-color-border-default));
        border-radius: var(--ds-radius-lg);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-info);
        box-shadow: var(--ds-shadow-control);
      }
      .icon ::slotted(*) {
        width: var(--ds-icon-lg);
        height: var(--ds-icon-lg);
      }
      strong {
        color: var(--ds-color-text-primary);
        font-size: var(--ds-font-size-lg);
      }
      small {
        max-width: 34rem;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
      .spinner {
        --ds-spinner-size: 1.5rem;
      }
    `,
  ];

  @query('input') private input!: HTMLInputElement;
  @property() label = 'Choose or drop files';
  @property() hint = '';
  @property() accept = '';
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) busy = false;
  @property({ type: Number, attribute: 'max-files' }) maxFiles = 1;
  @property({ attribute: false }) files: File[] = [];
  private dragDepth = 0;
  @property({ type: Boolean, reflect: true }) dragging = false;

  override focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  open() {
    if (!this.disabled && !this.busy) this.input?.click();
  }

  private accepts(file: File) {
    if (!this.accept.trim()) return true;
    return this.accept.split(',').some((entry) => {
      const rule = entry.trim().toLowerCase();
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
  }

  private select(incoming: File[]) {
    const accepted = incoming.filter((file) => this.accepts(file));
    const rejectedType = incoming.filter((file) => !this.accepts(file));
    const limit = this.multiple ? Math.max(1, this.maxFiles) : 1;
    const selected = accepted.slice(0, limit);
    const rejectedLimit = accepted.slice(limit);
    this.files = selected;
    if (selected.length) this.emit<DsFilesDetail>('ds-files', { files: selected });
    if (rejectedType.length)
      this.emit<DsFileRejectDetail>('ds-file-reject', { files: rejectedType, reason: 'type' });
    if (rejectedLimit.length)
      this.emit<DsFileRejectDetail>('ds-file-reject', { files: rejectedLimit, reason: 'limit' });
  }

  private changed() {
    this.select([...(this.input.files ?? [])]);
  }

  private dragEnter(event: DragEvent) {
    event.preventDefault();
    if (this.disabled || this.busy) return;
    this.dragDepth += 1;
    this.dragging = true;
  }

  private dragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer)
      event.dataTransfer.dropEffect = this.disabled || this.busy ? 'none' : 'copy';
  }

  private dragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (!this.dragDepth) this.dragging = false;
  }

  private drop(event: DragEvent) {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging = false;
    if (this.disabled || this.busy) return;
    this.select([...(event.dataTransfer?.files ?? [])]);
  }

  protected override render() {
    const blocked = this.disabled || this.busy;
    return html`<label
      class="zone ${this.dragging ? 'dragging' : ''} ${this.disabled ? 'disabled' : ''} ${this.busy ? 'busy' : ''}"
      part="zone"
      aria-busy=${String(this.busy)}
      @dragenter=${this.dragEnter}
      @dragover=${this.dragOver}
      @dragleave=${this.dragLeave}
      @drop=${this.drop}
    >
      <input
        part="input"
        type="file"
        accept=${this.accept || nothing}
        ?multiple=${this.multiple}
        ?disabled=${blocked}
        @change=${this.changed}
      />
      <span class="icon" part="icon" aria-hidden="true">
        ${this.busy ? html`<span class="spinner"></span>` : html`<slot name="icon">⇧</slot>`}
      </span>
      <strong part="label">${this.label}</strong>
      ${this.hint ? html`<small part="hint">${this.hint}</small>` : nothing}
    </label>`;
  }
}
