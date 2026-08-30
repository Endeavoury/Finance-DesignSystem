import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Overlays',
  tags: ['autodocs'],
};

export default meta;

export const Dialog: StoryObj = {
  render: () =>
    html`<ds-stack>
      <ds-button
        @click=${() => (document.querySelector('ds-dialog') as HTMLElement & { show(): void })?.show()}
        >Open confirmation</ds-button
      >
      <ds-dialog heading="Delete connection?" description="This action cannot be undone.">
        Existing imported transactions remain available.
        <ds-inline slot="footer">
          <ds-button variant="secondary">Cancel</ds-button>
          <ds-button variant="danger">Delete connection</ds-button>
        </ds-inline>
      </ds-dialog>
    </ds-stack>`,
};

export const Drawer: StoryObj = {
  render: () =>
    html`<ds-stack>
      <ds-button
        @click=${() => (document.querySelector('ds-drawer') as HTMLElement & { show(): void })?.show()}
        >Open account details</ds-button
      >
      <ds-drawer heading="Account details" description="Daily account · 4300">
        <ds-stack>
          <ds-metric label="Current balance" value="€ 4,285.30"></ds-metric>
          <ds-disclosure summary="Identifiers">NL12 BANK 3456 7890 12</ds-disclosure>
        </ds-stack>
      </ds-drawer>
    </ds-stack>`,
};

export const Menu: StoryObj = {
  render: () =>
    html`<ds-menu label="Transaction actions">
      <span slot="trigger">Actions</span>
      <ds-menu-item value="edit"><ds-icon slot="icon" name="edit"></ds-icon>Edit</ds-menu-item>
      <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
      <ds-menu-item value="archive" disabled>Archive</ds-menu-item>
      <ds-menu-item value="delete" tone="danger">Delete</ds-menu-item>
    </ds-menu>`,
};

export const Tooltip: StoryObj = {
  render: () =>
    html`<ds-tooltip content="Refresh balances from the connected bank">
      <ds-icon-button label="Refresh balances" icon="refresh"></ds-icon-button>
    </ds-tooltip>`,
};
