import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = { title: 'Components/Tree navigation', tags: ['autodocs'] };
export default meta;

export const NodeNavigation: StoryObj = {
  render: () => html`<div style="max-width: 20rem">
    <ds-tree label="Master data systems">
      <ds-tree-item label="Commercial Node" value="commercial" expanded>
        <a href="#overview">Overview</a>
        <a href="#topology">Topology</a>
        <a href="#definitions">Definitions</a>
      </ds-tree-item>
      <ds-tree-item label="Reference Node" value="reference">
        <a href="#overview">Overview</a>
        <a href="#ontology">Ontology</a>
      </ds-tree-item>
    </ds-tree>
  </div>`,
};
