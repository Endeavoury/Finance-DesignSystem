import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { DsTableColumn } from '@endeavoury/kanosis';

const columns: DsTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'status', label: 'Status' },
];
const rows = [
  { id: '1', name: 'Atlas rollout', team: 'Platform', status: 'In progress' },
  { id: '2', name: 'Access review', team: 'Security', status: 'Needs review' },
  { id: '3', name: 'Workspace migration', team: 'Operations', status: 'Complete' },
];

const meta: Meta = {
  title: 'Components/Enterprise workflow',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;

export const DataWorkflow: StoryObj = {
  render: () =>
    html`<div style="max-width:1100px;margin:auto;padding:1.5rem;display:grid;gap:1rem">
      <ds-view-toolbar query="" placeholder="Search projects">
        <ds-button slot="actions" variant="secondary">Export</ds-button>
        <ds-button slot="actions">New project</ds-button>
      </ds-view-toolbar>
      <ds-filter-builder
        .fields=${[
          { key: 'team', label: 'Team' },
          { key: 'status', label: 'Status' },
        ]}
        .rules=${[{ field: 'status', operator: 'equals', value: 'In progress' }]}
      ></ds-filter-builder>
      <ds-bulk-actions count="2"
        ><ds-button variant="secondary">Assign</ds-button
        ><ds-button variant="danger">Archive</ds-button></ds-bulk-actions
      >
      <ds-data-grid .columns=${columns} .rows=${rows} selectable caption="Projects"></ds-data-grid>
      <div style="display:flex;gap:1rem;align-items:start;flex-wrap:wrap">
        <ds-column-manager
          .columns=${columns.map((column) => ({ key: String(column.key), label: column.label, visible: true }))}
        ></ds-column-manager>
        <ds-saved-view
          .views=${[
            { id: 'mine', label: 'My projects' },
            { id: 'review', label: 'Needs review' },
          ]}
        ></ds-saved-view>
      </div>
      <ds-combobox
        label="Owner"
        .options=${[
          { label: 'Platform team', value: 'platform' },
          { label: 'Security team', value: 'security' },
        ]}
      ></ds-combobox>
      <ds-validation-summary
        .errors=${[{ id: 'owner', message: 'Choose an owner before saving.' }]}
      ></ds-validation-summary>
    </div>`,
};
