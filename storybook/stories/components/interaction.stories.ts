import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Interaction',
  tags: ['autodocs'],
};

export default meta;

export const ThemeToggle: StoryObj = {
  render: () =>
    html`<ds-inline>
      <ds-theme-toggle theme="light"></ds-theme-toggle>
      <span>Switches and persists the document theme when configured with a storage key.</span>
    </ds-inline>`,
};

export const Tabs: StoryObj = {
  render: () =>
    html`<ds-tabs label="Account views" value="activity">
      <ds-tab value="activity" label="Activity">
        <ds-panel
          ><strong>Recent account activity</strong>
          <p>Arrow keys move between tabs.</p></ds-panel
        >
      </ds-tab>
      <ds-tab value="details" label="Details">
        <ds-panel
          ><strong>Account details</strong>
          <p>Panels preserve native slotted content.</p></ds-panel
        >
      </ds-tab>
      <ds-tab value="audit" label="Audit log" disabled>
        <ds-panel>This panel is unavailable.</ds-panel>
      </ds-tab>
    </ds-tabs>`,
};

export const Disclosure: StoryObj = {
  render: () =>
    html`<ds-stack>
      <ds-disclosure summary="How balances are calculated" open>
        Balances are calculated independently for every account and statement.
      </ds-disclosure>
      <ds-disclosure summary="Unavailable section" disabled>
        This content cannot currently be expanded.
      </ds-disclosure>
    </ds-stack>`,
};
