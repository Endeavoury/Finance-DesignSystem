import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Patterns/Adaptive layouts',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;

const paneContent = (heading: string, description: string) => html`<ds-pane-header>
    <div style="padding:var(--ds-space-4)"><strong>${heading}</strong></div>
  </ds-pane-header>
  <ds-pane-content scrollable>
    <div style="padding:var(--ds-space-4)"><p>${description}</p><slot></slot></div>
  </ds-pane-content>`;

export const ListDetail: StoryObj = {
  render: () => html`<div style="height:36rem;max-height:80vh">
    <ds-pane-group>
      <ds-pane position="left" style="--ds-pane-size:19rem">
        ${paneContent('Records', 'Choose a record to inspect.')}
        <ds-list label="Records">
          <ds-list-item value="one" selected>Commercial Node</ds-list-item>
          <ds-list-item value="two">Research Node</ds-list-item>
        </ds-list>
      </ds-pane>
      <ds-pane position="center">
        ${paneContent(
          'Commercial Node',
          'The detail region keeps reading and keyboard order after the list.',
        )}
      </ds-pane>
    </ds-pane-group>
  </div>`,
};

export const SupportingPane: StoryObj = {
  render: () => html`<div style="height:36rem;max-height:80vh">
    <ds-pane-group>
      <ds-pane position="center">
        ${paneContent('Canonical model', 'The primary work remains available at every width.')}
      </ds-pane>
      <ds-inspector-pane>
        ${paneContent('Properties', 'Supporting detail becomes an overlay below expanded width.')}
      </ds-inspector-pane>
    </ds-pane-group>
  </div>`,
};

export const Feed: StoryObj = {
  render: () => html`<ds-container>
    <ds-grid columns="3" responsive>
      ${['Summary', 'Activity', 'Approvals', 'Jobs', 'Audit', 'Changes'].map(
        (heading) => html`<ds-card heading=${heading}>Responsive feed content</ds-card>`,
      )}
    </ds-grid>
  </ds-container>`,
};
