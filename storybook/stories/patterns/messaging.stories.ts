import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = { title: 'Patterns/Messaging decisions', tags: ['autodocs'] };
export default meta;

export const ScopeAndUrgency: StoryObj = {
  render: () => html`<ds-stack gap="4">
    <ds-banner tone="warning" heading="Scheduled maintenance">
      Imports pause between 22:00 and 22:15. Work already saved is unaffected.
    </ds-banner>
    <ds-alert tone="danger" heading="Two fields need attention">
      Correct the fields marked below, then save again.
    </ds-alert>
    <ds-empty-state heading="No matching records">
      Remove a filter or search for another identifier.
      <ds-button slot="actions" variant="secondary">Clear filters</ds-button>
    </ds-empty-state>
    <ds-toast-region label="Background confirmations">
      <ds-toast heading="Export started" duration="0">
        The download will appear when it is ready.
      </ds-toast>
    </ds-toast-region>
  </ds-stack>`,
};
