import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = {
  title: 'Components/Enterprise governance',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
export const Governance: StoryObj = {
  render: () =>
    html`<div style="display:grid;gap:1rem;max-width:1000px;margin:auto;padding:1.5rem">
      <ds-maintenance-notice
        heading="Maintenance window"
        message="The deployment service will be read-only."
        until="Saturday 22:00 UTC"
      ></ds-maintenance-notice>
      <ds-role-badge label="Administrator" tone="admin"></ds-role-badge>
      <ds-permission-matrix
        .roles=${[
      { id: 'admin', label: 'Admin' },
      { id: 'viewer', label: 'Viewer' },
    ]}
        .permissions=${[
      { id: 'read', label: 'Read records' },
      { id: 'write', label: 'Edit records' },
      { id: 'deploy', label: 'Deploy changes' },
    ]}
      ></ds-permission-matrix>
      <ds-audit-log
        .entries=${[
      {
        id: '1',
        actor: 'Jordan Lee',
        action: 'Updated access policy',
        target: 'Production',
        time: '10:42 UTC',
      },
      { id: '2', actor: 'System', action: 'Deployment completed', time: '09:30 UTC' },
    ]}
      ></ds-audit-log>
      <ds-diff-viewer
        .lines=${[
      { type: 'unchanged', text: 'name: atlas' },
      { type: 'removed', text: 'region: eu-west' },
      { type: 'added', text: 'region: eu-central' },
    ]}
      ></ds-diff-viewer>
      <ds-json-editor
        label="Configuration"
        value='{"enabled":true}'
        language="json"
      ></ds-json-editor>
      <ds-code-editor
        label="Deployment script"
        value="npm run deploy"
        language="shell"
      ></ds-code-editor>
      <ds-help-panel heading="Need guidance?"
        ><a slot="links" href="#docs">Read documentation</a
        ><a slot="links" href="#support">Contact support</a></ds-help-panel
      >
      <div style="display:flex;gap:1rem;align-items:start">
        <ds-coachmark
          heading="New workflow"
          message="Use the command palette to find actions faster."
        ></ds-coachmark
        ><ds-tour
          open
          .steps=${[
      { id: 'one', heading: 'Welcome', body: 'This workspace keeps your team aligned.' },
      { id: 'two', heading: 'Finish', body: 'You are ready to get started.' },
    ]}
        ></ds-tour>
      </div>
      <ds-compare-view left-label="Current" right-label="Proposed">
        <pre slot="left">region: eu-west</pre>
        <pre slot="right">region: eu-central</pre>
      </ds-compare-view>
    </div>`,
};
