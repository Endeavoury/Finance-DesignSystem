import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

describe('representative accessibility compositions', () => {
  it('has no automatically detectable violations in the primary form controls', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Account settings</h1>
        <ds-input label="Account name" name="name" required></ds-input>
        <ds-select label="Type" name="type"></ds-select>
        <ds-checkbox name="enabled">Enabled</ds-checkbox>
        <ds-button variant="primary">Save</ds-button>
      </main>`;
    const select = document.querySelector('ds-select')!;
    select.options = [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
    ];
    await Promise.all(
      [
        ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
          'ds-input,ds-select,ds-checkbox,ds-button',
        ),
      ].map((element) => element.updateComplete),
    );
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('exposes status, busy, and empty feedback semantics', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Ledger</h1>
        <ds-alert tone="warning" heading="Review required">Some entries need a category.</ds-alert>
        <ds-loading-state label="Loading ledger"></ds-loading-state>
        <ds-empty-state heading="No transactions">Try another period.</ds-empty-state>
      </main>`;
    await Promise.all(
      [
        ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
          'ds-alert,ds-loading-state,ds-empty-state',
        ),
      ].map((element) => element.updateComplete),
    );
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in tabs, disclosure, upload, and progress', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Import statements</h1>
        <ds-tabs label="Import views" value="upload">
          <ds-tab value="upload" label="Upload">
            <ds-drop-zone label="Choose or drop files" hint="XML only" accept=".xml"></ds-drop-zone>
          </ds-tab>
          <ds-tab value="history" label="History">Previous imports</ds-tab>
        </ds-tabs>
        <ds-disclosure summary="Import requirements">Use CAMT XML files.</ds-disclosure>
        <ds-progress label="Import progress" value="40" show-value></ds-progress>
      </main>`;
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
        'ds-tabs,ds-tab,ds-drop-zone,ds-disclosure,ds-progress',
      ),
    ];
    await Promise.all(elements.map((element) => element.updateComplete));
    const tabs = document.querySelector('ds-tabs')!;
    tabs.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));
    await tabs.updateComplete;
    await Promise.all(elements.map((element) => element.updateComplete));

    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in expanded forms and navigation', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Export settings</h1>
        <ds-breadcrumbs label="Current location">
          <ds-breadcrumb href="#home">Home</ds-breadcrumb>
          <ds-breadcrumb current>Export</ds-breadcrumb>
        </ds-breadcrumbs>
        <ds-textarea label="Export note" helpText="Optional context"></ds-textarea>
        <ds-switch checked>Email when ready</ds-switch>
        <ds-range label="Detail level" value="60" show-value></ds-range>
        <ds-radio-group label="Format" value="csv" required>
          <ds-radio value="csv">CSV</ds-radio>
          <ds-radio value="xml">XML</ds-radio>
        </ds-radio-group>
        <ds-pagination label="Results" page="2" pages="6"></ds-pagination>
        <ds-list label="Exports">
          <ds-list-item value="august">August export</ds-list-item>
        </ds-list>
      </main>`;
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
        'ds-breadcrumbs,ds-breadcrumb,ds-textarea,ds-switch,ds-range,ds-radio-group,ds-radio,ds-pagination,ds-list,ds-list-item',
      ),
    ];
    await Promise.all(elements.map((element) => element.updateComplete));
    document
      .querySelector('ds-radio-group')!
      .shadowRoot!.querySelector('slot')!
      .dispatchEvent(new Event('slotchange'));
    await Promise.all(elements.map((element) => element.updateComplete));

    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in semantic metadata and tree navigation', async () => {
    document.body.innerHTML = `<main><h1>Node metadata</h1>
      <ds-tree label="Master data systems"><ds-tree-item label="Commercial Node" value="commercial"><a href="#topology">Topology</a></ds-tree-item></ds-tree>
      <ds-description-list></ds-description-list>
      <ds-code-block label="Canonical model" language="YAML">name: Customer</ds-code-block>
    </main>`;
    const descriptions = document.querySelector('ds-description-list')!;
    descriptions.items = [{ term: 'Version', value: '1.0.0' }];
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
        'ds-tree,ds-tree-item,ds-description-list,ds-code-block',
      ),
    ];
    await Promise.all(elements.map((element) => element.updateComplete));
    document
      .querySelector('ds-tree-item')!
      .shadowRoot!.querySelector('slot:not([name])')!
      .dispatchEvent(new Event('slotchange'));
    await Promise.all(elements.map((element) => element.updateComplete));
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in menus, toasts, and open dialogs', async () => {
    document.body.innerHTML = `
      <main>
        <h1>Account actions</h1>
        <ds-menu label="Account actions" open>
          <span slot="trigger">Actions</span>
          <ds-menu-item value="edit">Edit account</ds-menu-item>
          <ds-menu-item value="remove" tone="danger">Remove account</ds-menu-item>
        </ds-menu>
        <ds-toast-region label="Notifications">
          <ds-toast heading="Account updated" duration="0">Changes are now live.</ds-toast>
        </ds-toast-region>
        <ds-dialog heading="Confirm removal" open>
          Imported records will remain available.
        </ds-dialog>
      </main>`;
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
        'ds-menu,ds-menu-item,ds-toast-region,ds-toast,ds-dialog',
      ),
    ];
    await Promise.all(elements.map((element) => element.updateComplete));

    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in mature action, asset, and reorder additions', async () => {
    document.body.innerHTML = `<main><h1>Workspace preferences</h1>
      <ds-segmented-control label="Density" value="comfortable">
        <ds-segment value="compact">Compact</ds-segment>
        <ds-segment value="comfortable">Comfortable</ds-segment>
      </ds-segmented-control>
      <ds-action-bar label="Workspace actions">
        <ds-button>Save</ds-button><ds-button slot="overflow">Archive</ds-button>
      </ds-action-bar>
      <ds-split-button label="Publish" menu-label="Publishing options">
        Publish<ds-menu-item slot="menu" value="draft">Save draft</ds-menu-item>
      </ds-split-button>
      <ds-chip value="active" label="Active" dismissible>Active</ds-chip>
      <ds-input-group label="Account code"><span slot="prefix">AC-</span><ds-input label="Code"></ds-input></ds-input-group>
      <ds-reorder-list label="Panels">
        <ds-reorder-item value="summary" label="Summary">Summary</ds-reorder-item>
        <ds-reorder-item value="activity" label="Activity">Activity</ds-reorder-item>
      </ds-reorder-list>
      <ds-illustration variant="empty" label="No panels"></ds-illustration>
      <ds-brand-mark></ds-brand-mark>
      <ds-live-region message="Preferences loaded"></ds-live-region>
    </main>`;
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>('main *'),
    ].filter((element) => element.localName.startsWith('ds-'));
    await Promise.all(elements.map((element) => element.updateComplete));
    document
      .querySelector('ds-segmented-control')!
      .shadowRoot!.querySelector('slot')!
      .dispatchEvent(new Event('slotchange'));
    await Promise.all(elements.map((element) => element.updateComplete));
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });

  it('has no detectable violations in labeled, sortable, paged data tables and grids', async () => {
    document.body.innerHTML = `<main><h1>Accounts</h1>
      <ds-data-table caption="Account balances" description="Balances at close of business"></ds-data-table>
      <ds-data-grid label="Pending accounts"></ds-data-grid>
    </main>`;
    const columns = [
      { key: 'name', label: 'Account', rowHeader: true, sortable: true },
      { key: 'balance', label: 'Balance', numeric: true, sortable: true },
    ];
    const rows = [{ id: 'cash', name: 'Cash', balance: 1250 }];
    const elements = [
      ...document.querySelectorAll<HTMLElement & { updateComplete: Promise<unknown> }>(
        'ds-data-table,ds-data-grid',
      ),
    ];
    for (const element of elements) {
      Object.assign(element, { columns, rows, pageSize: 10, totalRows: 12 });
    }
    await Promise.all(elements.map((element) => element.updateComplete));
    const result = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
