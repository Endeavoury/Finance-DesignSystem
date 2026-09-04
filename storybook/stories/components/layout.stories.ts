import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const box = (label: string) =>
  html`<div
    style="min-height:48px;padding:12px;border:1px solid var(--ds-color-border-default);border-radius:6px;background:var(--ds-color-bg-surface)"
  >
    ${label}
  </div>`;
const meta: Meta = { title: 'Components/Layout', tags: ['autodocs'] };
export default meta;
export const Stack: StoryObj = {
  render: () => html`<ds-stack gap="3">${box('First')}${box('Second')}${box('Third')}</ds-stack>`,
};
export const Inline: StoryObj = {
  render: () =>
    html`<ds-inline justify="between"
      ><ds-inline><ds-badge>Filter one</ds-badge><ds-badge>Filter two</ds-badge></ds-inline
      ><ds-button size="small">Apply</ds-button></ds-inline
    >`,
};
export const Grid: StoryObj = {
  render: () =>
    html`<ds-grid columns="4" responsive>${['One', 'Two', 'Three', 'Four'].map(box)}</ds-grid>`,
};
export const Container: StoryObj = {
  render: () =>
    html`<ds-container size="narrow">${box('Narrow centered content container')}</ds-container>`,
};
export const PageHeader: StoryObj = {
  render: () =>
    html`<ds-page-header
      eyebrow="Personal finance"
      heading="Account ledger"
      description="Filter, inspect, and categorize normalized bank entries."
      ><ds-inline slot="actions"
        ><ds-icon-button label="Refresh"><ds-icon name="refresh"></ds-icon></ds-icon-button
        ><ds-button>Import files</ds-button></ds-inline
      ></ds-page-header
    >`,
};

export const PaneWorkspace: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () =>
    html`<div style="height:100dvh;min-width:0;min-height:0;overflow:hidden">
      <ds-pane-group>
        <ds-pane position="left" style="--ds-pane-size:16rem">
          <ds-pane-header
            ><strong style="display:block;padding:1rem">Navigation</strong></ds-pane-header
          >
          <ds-scrollable-pane style="padding:1rem">
            <ds-stack gap="2">
              ${Array.from({ length: 24 }, (_, index) => box(`Navigation item ${index + 1}`))}
            </ds-stack>
          </ds-scrollable-pane>
        </ds-pane>
        <ds-pane position="center">
          <ds-pane-header
            ><strong style="display:block;padding:1rem">Workspace toolbar</strong></ds-pane-header
          >
          <ds-pane-content scrollable style="padding:1rem">
            <ds-stack
              >${Array.from({ length: 30 }, (_, index) => box(`Content row ${index + 1}`))}</ds-stack
            >
          </ds-pane-content>
        </ds-pane>
        <ds-inspector-pane>
          <ds-pane-header
            ><strong style="display:block;padding:1rem">Inspector</strong></ds-pane-header
          >
          <ds-scrollable-pane style="padding:1rem">
            ${Array.from({ length: 12 }, (_, index) => box(`Property ${index + 1}`))}
          </ds-scrollable-pane>
        </ds-inspector-pane>
      </ds-pane-group>
    </div>`,
};

export const ShellPaneWorkspace: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () =>
    html`<ds-app-shell content-mode="pane">
      <ds-sidebar slot="sidebar" label="Workspace navigation">
        <strong slot="brand">Pane workspace</strong>
        ${Array.from(
        { length: 28 },
        (_, index) =>
          html`<ds-sidebar-item value=${`item-${index + 1}`} ?active=${index === 0}>
            <ds-icon slot="icon" name="table"></ds-icon>Item ${index + 1}
          </ds-sidebar-item>`,
      )}
        <ds-status-badge slot="footer" tone="success">Connected</ds-status-badge>
      </ds-sidebar>
      <ds-inline slot="header" justify="between" style="height:100%;padding:0 1rem">
        <strong>Fixed workspace toolbar</strong>
        <ds-icon-button label="Open commands"><ds-icon name="search"></ds-icon></ds-icon-button>
      </ds-inline>
      <ds-pane-group orientation="vertical">
        <ds-pane position="top" style="--ds-pane-size:3.25rem">
          <ds-pane-header
            ><span style="display:block;padding:1rem">Fixed tabs</span></ds-pane-header
          >
        </ds-pane>
        <ds-pane position="center">
          <ds-pane-content scrollable style="padding:1rem">
            <ds-stack
              >${Array.from({ length: 32 }, (_, index) => box(`Content row ${index + 1}`))}</ds-stack
            >
          </ds-pane-content>
        </ds-pane>
        <ds-pane position="bottom" style="--ds-pane-size:3rem">
          <span style="display:block;padding:.875rem 1rem">Fixed status bar</span>
        </ds-pane>
      </ds-pane-group>
      <ds-inspector-pane slot="inspector">
        <ds-pane-header
          ><strong style="display:block;padding:1rem">Inspector</strong></ds-pane-header
        >
        <ds-scrollable-pane style="padding:1rem">
          <ds-stack gap="2"
            >${Array.from({ length: 18 }, (_, index) => box(`Property ${index + 1}`))}</ds-stack
          >
        </ds-scrollable-pane>
      </ds-inspector-pane>
    </ds-app-shell>`,
};

export const CollapsedShellPanes: StoryObj = {
  parameters: { layout: 'fullscreen' },
  render: () =>
    html`<ds-app-shell content-mode="pane" sidebar-collapsed>
      <ds-sidebar slot="sidebar" collapsed><strong slot="brand">Navigation</strong></ds-sidebar>
      <ds-pane-group>
        <ds-pane position="center">
          <ds-pane-header
            ><strong style="display:block;padding:1rem">Workspace only</strong></ds-pane-header
          >
          <ds-pane-content scrollable style="padding:1rem"
            >${box('Side panes are collapsed')}</ds-pane-content
          >
        </ds-pane>
      </ds-pane-group>
      <ds-inspector-pane slot="inspector" collapsed></ds-inspector-pane>
    </ds-app-shell>`,
};

export const DetailSidebar: StoryObj = {
  render: () =>
    html`<div style="min-height:42rem;padding:2rem">
      <ds-page-header
        eyebrow="Dashboard"
        heading="Financial overview"
        description="Select an insight to inspect its matching ledger entries."
      ></ds-page-header>
      <ds-detail-sidebar open heading="Groceries" close-label="Close insight details">
        <ds-stack slot="summary" gap="2">
          <span style="color:var(--ds-color-text-muted)">Selected insight</span>
          <strong style="font-size:1.75rem">€842.31</strong>
          <span>Food · 14 transactions</span>
        </ds-stack>
        <ds-stack gap="3">
          <strong>Ledger entries</strong>
          ${['Market Square', 'Fresh Foods', 'Corner Shop'].map(
            (name, index) =>
              html`<ds-card>
                <ds-inline justify="between" wrap="false">
                  <span
                    ><strong>${name}</strong><br /><small>August ${18 - index}, 2026</small></span
                  >
                  <strong>−€${[64.23, 42.9, 18.75][index]}</strong>
                </ds-inline>
              </ds-card>`,
          )}
        </ds-stack>
        <ds-button slot="footer" variant="secondary" full-width>View full ledger</ds-button>
      </ds-detail-sidebar>
    </div>`,
};

export const ModalDetailSidebar: StoryObj = {
  render: () =>
    html`<div style="min-height:42rem;padding:2rem">
      <ds-page-header heading="Account ledger"></ds-page-header>
      <ds-detail-sidebar open modal heading="Transaction details">
        <p slot="summary">A modal drawer blocks interaction with the page until it is closed.</p>
        <p>Use this variant for focused tasks instead of persistent dashboard context.</p>
      </ds-detail-sidebar>
    </div>`,
};
