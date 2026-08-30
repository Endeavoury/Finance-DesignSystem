import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = { title: 'Components/Feedback', tags: ['autodocs'] };
export default meta;
export const Alerts: StoryObj = {
  render: () =>
    html`<ds-stack
      >${['info', 'success', 'warning', 'danger'].map((tone) => html`<ds-alert tone=${tone} heading=${tone[0]!.toUpperCase() + tone.slice(1)} ?dismissible=${tone === 'info'}>A concise message explains what happened and what the user can do next.</ds-alert>`)}</ds-stack
    >`,
};
export const Loading: StoryObj = {
  render: () => html`<ds-loading-state label="Calculating financial overview"></ds-loading-state>`,
};
export const Empty: StoryObj = {
  render: () =>
    html`<ds-empty-state
      heading="No transactions found"
      description="Change the filters or import a bank statement to populate this view."
      ><ds-icon slot="icon" name="table"></ds-icon
      ><ds-button slot="actions">Import statement</ds-button></ds-empty-state
    >`,
};

export const Progress: StoryObj = {
  render: () =>
    html`<ds-stack>
      <ds-progress label="Importing statements" value="68" show-value></ds-progress>
      <ds-progress label="Validating transactions" tone="success"></ds-progress>
      <ds-progress label="Storage usage" value="86" tone="warning" show-value></ds-progress>
    </ds-stack>`,
};

export const Skeletons: StoryObj = {
  render: () =>
    html`<ds-inline wrap="false" align="start">
      <ds-skeleton shape="circle" width="3rem" height="3rem"></ds-skeleton>
      <ds-stack style="width:min(100%,28rem)" gap="2">
        <ds-skeleton width="42%" height="1.1rem"></ds-skeleton>
        <ds-skeleton width="100%"></ds-skeleton>
        <ds-skeleton width="76%"></ds-skeleton>
      </ds-stack>
    </ds-inline>`,
};

export const Toasts: StoryObj = {
  render: () =>
    html`<div style="min-height:16rem">
      <ds-toast-region label="Example notifications">
        <ds-toast heading="Import completed" tone="success" duration="0">
          24 new transactions were added.
        </ds-toast>
        <ds-toast heading="Connection needs attention" tone="warning" duration="0">
          Reconnect the bank to refresh balances.
          <ds-button slot="actions" size="small" variant="secondary">Reconnect</ds-button>
        </ds-toast>
      </ds-toast-region>
    </div>`,
};
