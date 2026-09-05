import { html } from 'lit';
import { fireEvent } from '@testing-library/dom';
import { describe, expect, it, vi } from 'vitest';
import type {
  DsCheckbox,
  DsAppShell,
  DsDataTable,
  DsInput,
  DsMenu,
  DsPagination,
  DsPane,
  DsPaneContent,
  DsPaneGroup,
  DsRadioGroup,
  DsSelect,
  DsSidebarItem,
  DsTabs,
} from '@endeavoury/kanosis/classes';
import { DsBulkActions, DsCombobox, DsFilterBuilder } from '@endeavoury/kanosis/classes';
import type { DsCommandPalette, DsWorkspaceTabs } from '@endeavoury/kanosis/classes';
import type { DsDatePicker, DsStepper, DsTaskList } from '@endeavoury/kanosis/classes';
import type { DsPermissionMatrix, DsJsonEditor, DsDiffViewer } from '@endeavoury/kanosis/classes';
import type {
  DsChip,
  DsElement,
  DsReorderList,
  DsSegmentedControl,
  DsSplitButton,
} from '@endeavoury/kanosis/classes';

const mount = async <T extends HTMLElement>(element: T): Promise<T> => {
  document.body.append(element);
  await (element as T & { updateComplete?: Promise<unknown> }).updateComplete;
  return element;
};

describe('actions and forms', () => {
  it('renders button content and forwards native activation', async () => {
    const button = await mount(document.createElement('ds-button'));
    button.textContent = 'Save';
    const listener = vi.fn();
    button.addEventListener('click', listener);
    fireEvent.click(button.shadowRoot!.querySelector('button')!);
    expect(listener).toHaveBeenCalledOnce();
    const slot = button.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).toContain('Save');
  });

  it('submits its containing native form when configured as submit', async () => {
    const form = document.createElement('form');
    const button = document.createElement('ds-button');
    button.type = 'submit';
    button.textContent = 'Save';
    form.append(button);
    document.body.append(form);
    await button.updateComplete;
    const listener = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', listener);
    fireEvent.click(button.shadowRoot!.querySelector('button')!);
    expect(listener).toHaveBeenCalledOnce();
  });

  it('renders navigation actions as safe, accessible links', async () => {
    const button = await mount(document.createElement('ds-button'));
    button.href = '/documentation';
    button.target = '_blank';
    button.textContent = 'Documentation';
    await button.updateComplete;
    const link = button.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/documentation');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    button.disabled = true;
    await button.updateComplete;
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.hasAttribute('href')).toBe(false);
  });

  it('emits composed typed input and change events', async () => {
    const input = (await mount(document.createElement('ds-input'))) as DsInput;
    input.label = 'Account name';
    const inputListener = vi.fn();
    const changeListener = vi.fn();
    input.addEventListener('ds-input', inputListener);
    input.addEventListener('ds-change', changeListener);
    await input.updateComplete;
    const native = input.shadowRoot!.querySelector('input')!;
    native.value = 'Savings';
    fireEvent.input(native);
    fireEvent.change(native);
    expect(input.value).toBe('Savings');
    expect(inputListener.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { value: 'Savings' },
    });
    expect(changeListener.mock.calls[0][0].detail).toEqual({ value: 'Savings' });
  });

  it('binds structured select options through a JavaScript property', async () => {
    const select = (await mount(document.createElement('ds-select'))) as DsSelect;
    select.options = [
      { label: 'Personal', value: 'personal' },
      { label: 'Business', value: 'business' },
    ];
    await select.updateComplete;
    const native = select.shadowRoot!.querySelector('select')!;
    native.value = 'business';
    fireEvent.change(native);
    expect(select.value).toBe('business');
  });

  it('toggles a checkbox once from label or keyboard activation', async () => {
    const checkbox = (await mount(document.createElement('ds-checkbox'))) as DsCheckbox;
    const listener = vi.fn();
    checkbox.addEventListener('ds-change', listener);
    await checkbox.updateComplete;
    fireEvent.click(checkbox.shadowRoot!.querySelector('label')!);
    expect(checkbox.checked).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    fireEvent.keyDown(checkbox.shadowRoot!.querySelector('[role=checkbox]')!, { key: ' ' });
    expect(checkbox.checked).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('data and navigation', () => {
  it('sorts rows and announces sorting through a custom event', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'amount', label: 'Amount', sortable: true }];
    table.rows = [
      { id: 'b', amount: 20 },
      { id: 'a', amount: 10 },
    ];
    const listener = vi.fn();
    table.addEventListener('ds-sort', listener);
    await table.updateComplete;
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await table.updateComplete;
    expect(listener.mock.calls[0][0].detail).toEqual({ key: 'amount', direction: 'ascending' });
    expect(
      [...table.shadowRoot!.querySelectorAll('tbody td')].map((cell) => cell.textContent),
    ).toEqual(['10', '20']);
  });

  it('selects rows by pointer and keyboard with the configured key', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'name', label: 'Name' }];
    table.rows = [{ id: 'account-1', name: 'Current' }];
    table.selectable = true;
    const listener = vi.fn();
    table.addEventListener('ds-row-select', listener);
    await table.updateComplete;
    fireEvent.keyDown(table.shadowRoot!.querySelector('tbody tr')!, { key: 'Enter' });
    expect(table.selectedKey).toBe('account-1');
    expect(listener.mock.calls[0][0].detail.key).toBe('account-1');
  });

  it('sorts signed decimal numbers correctly and keeps missing values last', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'amount', label: 'Amount', sortable: true, numeric: true }];
    table.rows = [3.12, -2, null, 3.5, -10].map((amount) => ({ amount }));
    const values = () =>
      [...table.shadowRoot!.querySelectorAll('tbody td')].map((cell) => cell.textContent);
    await table.updateComplete;
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await table.updateComplete;
    expect(values()).toEqual(['-10', '-2', '3.12', '3.5', '—']);
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await table.updateComplete;
    expect(values()).toEqual(['3.5', '3.12', '-2', '-10', '—']);
    expect(table.rows.map((row) => row['amount'])).toEqual([3.12, -2, null, 3.5, -10]);
  });

  it('preserves fallback row identity across sorting and pagination', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'name', label: 'Name', sortable: true }];
    table.rows = [{ name: 'Zulu' }, { name: 'Alpha' }, { name: 'Beta' }];
    table.selectable = true;
    table.pageSize = 1;
    const listener = vi.fn();
    table.addEventListener('ds-row-select', listener);
    await table.updateComplete;
    fireEvent.click(table.shadowRoot!.querySelector('tbody tr')!);
    expect(table.selectedKey).toBe('0');
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('[data-selected]')).toBeNull();
    table.page = 3;
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('[data-selected]')?.textContent).toContain('Zulu');
    fireEvent.click(table.shadowRoot!.querySelector('tbody tr')!);
    expect(listener.mock.lastCall![0].detail).toEqual({ row: table.rows[0], index: 0, key: '0' });
  });

  it('clamps pages after filtering and reports the visible range', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.columns = [{ key: 'name', label: 'Name' }];
    table.rows = ['A', 'B', 'C', 'D', 'E'].map((name) => ({ name }));
    table.pageSize = 2;
    table.page = 3;
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('.range')?.textContent).toBe('5–5 of 5 rows');
    table.rows = table.rows.slice(0, 3);
    await table.updateComplete;
    expect(table.page).toBe(2);
    expect(table.shadowRoot!.querySelector('tbody td')?.textContent).toBe('C');
    expect(table.shadowRoot!.querySelector('.range')?.textContent).toBe('3–3 of 3 rows');
    table.rows = [];
    await table.updateComplete;
    expect(table.page).toBe(1);
    expect(table.shadowRoot!.querySelector('.empty')).not.toBeNull();
  });

  it('keeps inline actions independent from row activation and blocks changes while busy', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    const action = vi.fn();
    const selection = vi.fn();
    table.columns = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        format: (value) => html`<button @click=${action}>Edit ${value}</button>`,
      },
    ];
    table.rows = [{ name: 'Alpha' }, { name: 'Beta' }];
    table.selectable = true;
    table.pageSize = 1;
    table.addEventListener('ds-row-select', selection);
    await table.updateComplete;
    const button = table.shadowRoot!.querySelector('tbody button')!;
    fireEvent.click(button);
    const keydown = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    button.dispatchEvent(keydown);
    expect(action).toHaveBeenCalledOnce();
    expect(selection).not.toHaveBeenCalled();
    expect(keydown.defaultPrevented).toBe(false);
    table.busy = true;
    await table.updateComplete;
    fireEvent.keyDown(table.shadowRoot!.querySelector('tbody tr')!, { key: 'Enter' });
    expect(selection).not.toHaveBeenCalled();
    expect(table.shadowRoot!.querySelector<HTMLButtonElement>('.sort')!.disabled).toBe(true);
    expect(
      table.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!.disabled,
    ).toBe(true);
  });

  it('emits navigation activation across the shadow boundary', async () => {
    const item = (await mount(document.createElement('ds-sidebar-item'))) as DsSidebarItem;
    item.value = 'ledger';
    const listener = vi.fn();
    item.addEventListener('ds-activate', listener);
    await item.updateComplete;
    fireEvent.click(item.shadowRoot!.querySelector('button,a')!);
    expect(listener.mock.calls[0][0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { value: 'ledger' },
    });
  });

  it('closes a detail sidebar from its button and the Escape key', async () => {
    const sidebar = await mount(document.createElement('ds-detail-sidebar'));
    sidebar.open = true;
    sidebar.heading = 'Selected insight';
    const listener = vi.fn();
    sidebar.addEventListener('ds-close', listener);
    await sidebar.updateComplete;

    expect(sidebar.shadowRoot!.querySelector('aside')?.getAttribute('aria-labelledby')).toBe(
      'detail-sidebar-title',
    );
    fireEvent.keyDown(sidebar.shadowRoot!.querySelector('aside')!, { key: 'Escape' });
    fireEvent.click(sidebar.shadowRoot!.querySelector('.close')!);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe('display foundations', () => {
  it('provides enterprise workflow primitives with composed events', async () => {
    const filters = (await mount(document.createElement('ds-filter-builder'))) as DsFilterBuilder;
    filters.fields = [{ key: 'status', label: 'Status' }];
    const listener = vi.fn();
    filters.addEventListener('ds-filter-change', listener);
    await filters.updateComplete;
    fireEvent.click(filters.shadowRoot!.querySelector('button')!);
    expect(listener).toHaveBeenCalled();
    expect(filters.rules).toHaveLength(1);

    const bulk = (await mount(document.createElement('ds-bulk-actions'))) as DsBulkActions;
    bulk.count = 3;
    const clear = vi.fn();
    bulk.addEventListener('ds-clear-selection', clear);
    await bulk.updateComplete;
    fireEvent.click([...bulk.shadowRoot!.querySelectorAll('button')].at(-1)!);
    expect(clear).toHaveBeenCalledOnce();

    const combo = (await mount(document.createElement('ds-combobox'))) as DsCombobox;
    combo.options = [{ label: 'Platform', value: 'platform' }];
    await combo.updateComplete;
    const comboInput = combo.shadowRoot!.querySelector('input')!;
    comboInput.value = 'Plat';
    fireEvent.input(comboInput);
    await combo.updateComplete;
    expect(combo.shadowRoot!.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it('supports P1 command and workspace interactions', async () => {
    const palette = (await mount(document.createElement('ds-command-palette'))) as DsCommandPalette;
    palette.commands = [{ id: 'create', label: 'Create project' }];
    palette.open = true;
    const selected = vi.fn();
    palette.addEventListener('ds-command-select', selected);
    await palette.updateComplete;
    fireEvent.keyDown(palette.shadowRoot!.querySelector('input')!, { key: 'Enter' });
    expect(selected).toHaveBeenCalledOnce();

    const tabs = (await mount(document.createElement('ds-workspace-tabs'))) as DsWorkspaceTabs;
    tabs.tabs = [{ id: 'one', label: 'One', closable: true }];
    tabs.value = 'one';
    const closed = vi.fn();
    tabs.addEventListener('ds-tab-close', closed);
    await tabs.updateComplete;
    fireEvent.click(tabs.shadowRoot!.querySelector('.close')!);
    expect(closed).toHaveBeenCalledOnce();
  });

  it('supports P2 workflow state changes', async () => {
    const date = (await mount(document.createElement('ds-date-picker'))) as DsDatePicker;
    const changed = vi.fn();
    date.addEventListener('ds-change', changed);
    await date.updateComplete;
    const control = date.shadowRoot!.querySelector('input')!;
    control.value = '2026-09-04';
    fireEvent.change(control);
    expect(changed).toHaveBeenCalledOnce();

    const stepper = (await mount(document.createElement('ds-stepper'))) as DsStepper;
    stepper.steps = [
      { id: 'one', label: 'One' },
      { id: 'two', label: 'Two' },
    ];
    const stepChanged = vi.fn();
    stepper.addEventListener('ds-step-change', stepChanged);
    await stepper.updateComplete;
    fireEvent.click(stepper.shadowRoot!.querySelectorAll('button')[1]!);
    expect(stepChanged).toHaveBeenCalledOnce();

    const tasks = (await mount(document.createElement('ds-task-list'))) as DsTaskList;
    tasks.tasks = [{ id: 'task', title: 'Review', completed: false }];
    const taskChanged = vi.fn();
    tasks.addEventListener('ds-task-change', taskChanged);
    await tasks.updateComplete;
    fireEvent.click(tasks.shadowRoot!.querySelector('input')!);
    expect(taskChanged).toHaveBeenCalledOnce();
  });

  it('supports P3 governance and configuration interactions', async () => {
    const matrix = (await mount(
      document.createElement('ds-permission-matrix'),
    )) as DsPermissionMatrix;
    matrix.roles = [{ id: 'admin', label: 'Admin' }];
    matrix.permissions = [{ id: 'read', label: 'Read' }];
    const permissionChanged = vi.fn();
    matrix.addEventListener('ds-permission-change', permissionChanged);
    await matrix.updateComplete;
    fireEvent.click(matrix.shadowRoot!.querySelector('input')!);
    expect(permissionChanged).toHaveBeenCalledOnce();

    const editor = (await mount(document.createElement('ds-json-editor'))) as DsJsonEditor;
    editor.value = '{"valid":true}';
    await editor.updateComplete;
    expect(editor.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    editor.value = '{invalid';
    await editor.updateComplete;
    expect(editor.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();

    const diff = (await mount(document.createElement('ds-diff-viewer'))) as DsDiffViewer;
    diff.lines = [{ type: 'added', text: 'new value' }];
    await diff.updateComplete;
    expect(diff.shadowRoot!.querySelector('[data-added]')).not.toBeNull();
  });

  it('keeps shell chrome outside the scrollable workspace and supports pane mode', async () => {
    const shell = (await mount(document.createElement('ds-app-shell'))) as DsAppShell;
    const sidebar = document.createElement('ds-sidebar');
    sidebar.slot = 'sidebar';
    const header = document.createElement('div');
    header.slot = 'header';
    const inspector = document.createElement('ds-inspector-pane');
    inspector.slot = 'inspector';
    shell.append(sidebar, header, inspector);
    shell.contentMode = 'pane';
    shell.sidebarCollapsed = true;
    await shell.updateComplete;

    expect(shell.getAttribute('content-mode')).toBe('pane');
    expect(shell.hasAttribute('sidebar-collapsed')).toBe(true);
    expect(shell.shadowRoot!.querySelector('header')?.hasAttribute('hidden')).toBe(false);
    expect(shell.shadowRoot!.querySelector('.workspace-body')).not.toBeNull();
    expect(shell.shadowRoot!.querySelector('slot[name="inspector"]')).not.toBeNull();
  });

  it('collapses and reopens sidebar navigation with an accessible persistent control', async () => {
    const shell = (await mount(document.createElement('ds-app-shell'))) as DsAppShell;
    expect(shell.shadowRoot!.querySelector('.sidebar-toggle')).toBeNull();
    shell.innerHTML =
      '<ds-sidebar slot="sidebar"><ds-sidebar-item>Overview</ds-sidebar-item></ds-sidebar>';
    shell.shadowRoot!.querySelector('slot[name="sidebar"]')!.dispatchEvent(new Event('slotchange'));
    await shell.updateComplete;
    const toggle = shell.shadowRoot!.querySelector<HTMLButtonElement>('.sidebar-toggle')!;
    const listener = vi.fn();
    shell.addEventListener('ds-sidebar-toggle', listener);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    await shell.updateComplete;
    expect(shell.sidebarCollapsed).toBe(true);
    expect(shell.shadowRoot!.querySelector('aside')!.hasAttribute('inert')).toBe(true);
    expect(toggle.getAttribute('aria-label')).toBe('Expand sidebar');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(shell.shadowRoot!.querySelector('header')!.hidden).toBe(false);
    expect(listener.mock.lastCall![0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { collapsed: true },
    });
    fireEvent.click(toggle);
    await shell.updateComplete;
    expect(shell.sidebarCollapsed).toBe(false);
    expect(shell.shadowRoot!.querySelector('aside')!.hasAttribute('inert')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('composes fixed pane groups with explicit positions and scroll ownership', async () => {
    const group = (await mount(document.createElement('ds-pane-group'))) as DsPaneGroup;
    const left = document.createElement('ds-pane') as DsPane;
    const center = document.createElement('ds-pane') as DsPane;
    const content = document.createElement('ds-pane-content') as DsPaneContent;
    left.position = 'left';
    center.position = 'center';
    content.scrollable = true;
    center.append(content);
    group.append(left, center);
    await Promise.all([left.updateComplete, center.updateComplete, content.updateComplete]);

    expect(group.orientation).toBe('horizontal');
    expect(left.getAttribute('position')).toBe('left');
    expect(center.getAttribute('position')).toBe('center');
    expect(content.hasAttribute('scrollable')).toBe(true);
    left.collapsed = true;
    await left.updateComplete;
    expect(left.hasAttribute('collapsed')).toBe(true);
  });

  it('creates icon geometry in the SVG namespace', async () => {
    const icon = await mount(document.createElement('ds-icon'));
    icon.name = 'refresh';
    await icon.updateComplete;
    expect(icon.shadowRoot!.querySelector('path')?.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('renders structured descriptions and labeled code', async () => {
    const descriptions = await mount(document.createElement('ds-description-list'));
    descriptions.items = [{ term: 'Schema', value: 'Customer 2.0' }];
    await descriptions.updateComplete;
    expect(descriptions.shadowRoot!.querySelector('dt')?.textContent).toBe('Schema');
    expect(descriptions.shadowRoot!.querySelector('dd')?.textContent).toBe('Customer 2.0');

    const code = await mount(document.createElement('ds-code-block'));
    code.label = 'OpenAPI';
    code.language = 'JSON';
    code.textContent = '{ "openapi": "3.1.0" }';
    await code.updateComplete;
    expect(code.shadowRoot!.querySelector('pre')?.getAttribute('aria-label')).toBe('OpenAPI');
  });

  it('expands tree navigation and emits the selected value', async () => {
    const tree = document.createElement('ds-tree');
    const item = document.createElement('ds-tree-item');
    item.label = 'Commercial Node';
    item.value = 'commercial';
    item.append(document.createElement('a'));
    tree.append(item);
    document.body.append(tree);
    await Promise.all([tree.updateComplete, item.updateComplete]);
    fireEvent(item.shadowRoot!.querySelector('slot:not([name])')!, new Event('slotchange'));
    await item.updateComplete;
    const listener = vi.fn();
    item.addEventListener('ds-tree-activate', listener);
    fireEvent.click(item.shadowRoot!.querySelector('button')!);
    expect(item.expanded).toBe(true);
    expect(listener.mock.calls[0][0].detail).toEqual({ value: 'commercial' });
  });

  it('only exposes card regions that have assigned content', async () => {
    const card = await mount(document.createElement('ds-card'));
    const headerRegion = card.shadowRoot!.querySelector<HTMLElement>('.header')!;
    const footerRegion = card.shadowRoot!.querySelector<HTMLElement>('.footer')!;
    expect(headerRegion.hidden).toBe(true);
    expect(footerRegion.hidden).toBe(true);

    const heading = document.createElement('strong');
    heading.slot = 'header';
    heading.textContent = 'Account summary';
    card.append(heading);
    fireEvent(card.shadowRoot!.querySelector("slot[name='header']")!, new Event('slotchange'));
    await card.updateComplete;
    expect(headerRegion.hidden).toBe(false);
    expect(footerRegion.hidden).toBe(true);
  });
});

describe('maturity additions', () => {
  it('supports roving segmented selection', async () => {
    const control = document.createElement('ds-segmented-control') as DsSegmentedControl;
    control.value = 'month';
    for (const [value, label] of [
      ['week', 'Week'],
      ['month', 'Month'],
      ['year', 'Year'],
    ]) {
      const segment = document.createElement('ds-segment');
      segment.value = value;
      segment.textContent = label;
      control.append(segment);
    }
    const listener = vi.fn();
    control.addEventListener('ds-change', listener);
    await mount(control);
    await Promise.all([...control.children].map((child) => (child as DsElement).updateComplete));
    const year = control.children[2] as HTMLElement;
    fireEvent.click(year.shadowRoot!.querySelector('button')!);
    expect(control.value).toBe('year');
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: 'year' }, bubbles: true, composed: true }),
    );
  });

  it('exposes split-button and chip intent as composed events', async () => {
    const split = (await mount(document.createElement('ds-split-button'))) as DsSplitButton;
    const activate = vi.fn();
    split.addEventListener('ds-activate', activate);
    fireEvent.click(split.shadowRoot!.querySelector('.primary')!);
    expect(activate).toHaveBeenCalledOnce();

    const chip = (await mount(document.createElement('ds-chip'))) as DsChip;
    chip.value = 'open';
    chip.label = 'Open';
    chip.dismissible = true;
    await chip.updateComplete;
    const changed = vi.fn();
    const dismissed = vi.fn();
    chip.addEventListener('ds-change', changed);
    chip.addEventListener('ds-dismiss', dismissed);
    fireEvent.click(chip.shadowRoot!.querySelector('.select')!);
    fireEvent.click(chip.shadowRoot!.querySelector('.dismiss')!);
    expect(changed.mock.calls[0][0].detail).toEqual({ value: 'open', selected: true });
    expect(dismissed.mock.calls[0][0].detail).toEqual({ value: 'open', reason: 'button' });
  });

  it('offers a keyboard-operable alternative to drag reordering', async () => {
    const list = document.createElement('ds-reorder-list') as DsReorderList;
    for (const value of ['one', 'two', 'three']) {
      const item = document.createElement('ds-reorder-item');
      item.value = value;
      item.label = value;
      item.textContent = value;
      list.append(item);
    }
    const listener = vi.fn();
    list.addEventListener('ds-reorder', listener);
    await mount(list);
    await Promise.all([...list.children].map((child) => (child as DsElement).updateComplete));
    const second = list.children[1] as HTMLElement;
    fireEvent.click(second.shadowRoot!.querySelector('button')!);
    expect([...list.children].map((item) => (item as HTMLElement).getAttribute('value'))).toEqual([
      'two',
      'one',
      'three',
    ]);
    expect(listener.mock.calls[0][0].detail).toMatchObject({
      value: 'two',
      fromIndex: 1,
      toIndex: 0,
    });
  });

  it('announces data sorting, loading, and paging while retaining table semantics', async () => {
    const table = (await mount(document.createElement('ds-data-table'))) as DsDataTable;
    table.label = 'Projects';
    table.description = 'Active projects by owner';
    table.columns = [
      { key: 'name', label: 'Name', sortable: true, rowHeader: true },
      { key: 'count', label: 'Count', numeric: true },
    ];
    table.rows = [
      { id: 'a', name: 'Alpha', count: 2 },
      { id: 'b', name: 'Beta', count: 10 },
    ];
    table.pageSize = 1;
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('th[scope="row"]')).not.toBeNull();
    expect(table.shadowRoot!.querySelector('td.numeric')?.textContent).toContain('2');
    fireEvent.click(table.shadowRoot!.querySelector('.sort')!);
    await new Promise((resolve) => globalThis.setTimeout(resolve, 30));
    expect(table.shadowRoot!.querySelector('[role="status"]')?.textContent).toContain(
      'Name sorted',
    );
    fireEvent.click(table.shadowRoot!.querySelector('[aria-label="Next page"]')!);
    expect(table.page).toBe(2);
  });
});

describe('interaction and workflow components', () => {
  it('switches the document theme and emits the new value', async () => {
    const toggle = await mount(document.createElement('ds-theme-toggle'));
    toggle.theme = 'dark';
    const listener = vi.fn();
    toggle.addEventListener('ds-theme-change', listener);
    await toggle.updateComplete;

    fireEvent.click(toggle.shadowRoot!.querySelector('button')!);
    await toggle.updateComplete;

    expect(toggle.theme).toBe('light');
    expect(document.documentElement.dataset.dsTheme).toBe('light');
    expect(listener.mock.calls[0][0].detail).toEqual({ theme: 'light' });
  });

  it('provides automatic keyboard navigation for tabs and skips disabled tabs', async () => {
    const tabs = document.createElement('ds-tabs') as DsTabs;
    tabs.value = 'activity';
    for (const [value, label, disabled] of [
      ['activity', 'Activity', false],
      ['disabled', 'Disabled', true],
      ['details', 'Details', false],
    ] as const) {
      const tab = document.createElement('ds-tab');
      tab.value = value;
      tab.label = label;
      tab.disabled = disabled;
      tab.textContent = `${label} panel`;
      tabs.append(tab);
    }
    const listener = vi.fn();
    tabs.addEventListener('ds-tab-change', listener);
    await mount(tabs);
    fireEvent(tabs.shadowRoot!.querySelector('slot')!, new Event('slotchange'));
    await tabs.updateComplete;

    fireEvent.keyDown(tabs.shadowRoot!.querySelector('[role=tablist]')!, { key: 'ArrowRight' });
    await tabs.updateComplete;

    expect(tabs.value).toBe('details');
    expect(listener.mock.calls[0][0].detail).toEqual({ value: 'details' });
    expect(
      [...tabs.querySelectorAll('ds-tab')].find((tab) => tab.value === 'details')!.active,
    ).toBe(true);
  });

  it('reports disclosure state changes', async () => {
    const disclosure = await mount(document.createElement('ds-disclosure'));
    disclosure.summary = 'Details';
    const listener = vi.fn();
    disclosure.addEventListener('ds-disclosure-change', listener);
    await disclosure.updateComplete;
    const details = disclosure.shadowRoot!.querySelector('details')!;
    details.open = true;
    fireEvent(details, new Event('toggle'));

    expect(disclosure.open).toBe(true);
    expect(listener.mock.calls[0][0].detail).toEqual({ open: true });
  });

  it('accepts matching dropped files and rejects unsupported types', async () => {
    const zone = await mount(document.createElement('ds-drop-zone'));
    zone.accept = '.xml';
    const accepted = vi.fn();
    const rejected = vi.fn();
    zone.addEventListener('ds-files', accepted);
    zone.addEventListener('ds-file-reject', rejected);
    await zone.updateComplete;
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: {
        files: [
          new File(['<xml/>'], 'statement.xml', { type: 'application/xml' }),
          new File(['text'], 'notes.txt', { type: 'text/plain' }),
        ],
      },
    });
    zone.shadowRoot!.querySelector('.zone')!.dispatchEvent(drop);

    expect(accepted.mock.calls[0][0].detail.files[0].name).toBe('statement.xml');
    expect(rejected.mock.calls[0][0].detail).toMatchObject({ reason: 'type' });
  });

  it('renders determinate and indeterminate progress semantics', async () => {
    const progress = await mount(document.createElement('ds-progress'));
    progress.label = 'Importing';
    progress.value = 25;
    progress.max = 50;
    progress.showValue = true;
    await progress.updateComplete;
    const native = progress.shadowRoot!.querySelector('progress')!;
    expect(native.value).toBe(25);
    expect(native.max).toBe(50);
    expect(progress.shadowRoot!.textContent).toContain('50%');

    progress.value = undefined;
    await progress.updateComplete;
    expect(native.hasAttribute('value')).toBe(false);
  });
});

describe('expanded component catalog', () => {
  it('supports textarea, switch, and range form events', async () => {
    const textarea = await mount(document.createElement('ds-textarea'));
    textarea.label = 'Note';
    const textChange = vi.fn();
    textarea.addEventListener('ds-input', textChange);
    await textarea.updateComplete;
    const nativeTextarea = textarea.shadowRoot!.querySelector('textarea')!;
    nativeTextarea.value = 'Reviewed';
    fireEvent.input(nativeTextarea);
    expect(textarea.value).toBe('Reviewed');
    expect(textChange.mock.calls[0][0].detail).toEqual({ value: 'Reviewed' });

    const toggle = await mount(document.createElement('ds-switch'));
    const switchChange = vi.fn();
    toggle.addEventListener('ds-change', switchChange);
    await toggle.updateComplete;
    fireEvent.click(toggle.shadowRoot!.querySelector('input')!);
    expect(toggle.checked).toBe(true);
    expect(switchChange.mock.calls[0][0].detail.checked).toBe(true);

    const range = await mount(document.createElement('ds-range'));
    const rangeInput = vi.fn();
    range.addEventListener('ds-input', rangeInput);
    await range.updateComplete;
    const nativeRange = range.shadowRoot!.querySelector('input')!;
    nativeRange.value = '48';
    fireEvent.input(nativeRange);
    expect(range.value).toBe('48');
    expect(rangeInput.mock.calls[0][0].detail).toEqual({ value: '48' });
  });

  it('provides arrow-key radio selection and skips disabled options', async () => {
    const group = document.createElement('ds-radio-group') as DsRadioGroup;
    group.value = 'monthly';
    for (const [value, disabled] of [
      ['monthly', false],
      ['quarterly', true],
      ['yearly', false],
    ] as const) {
      const radio = document.createElement('ds-radio');
      radio.value = value;
      radio.disabled = disabled;
      radio.textContent = value;
      group.append(radio);
    }
    const listener = vi.fn();
    group.addEventListener('ds-change', listener);
    await mount(group);
    fireEvent(group.shadowRoot!.querySelector('slot')!, new Event('slotchange'));
    await group.updateComplete;
    fireEvent.keyDown(group.shadowRoot!.querySelector('[role=radiogroup]')!, {
      key: 'ArrowRight',
    });

    expect(group.value).toBe('yearly');
    expect(listener.mock.calls[0][0].detail).toEqual({ value: 'yearly' });
  });

  it('dismisses modal surfaces with an explicit reason', async () => {
    const dialog = await mount(document.createElement('ds-dialog'));
    dialog.heading = 'Confirm action';
    dialog.open = true;
    const listener = vi.fn();
    dialog.addEventListener('ds-close', listener);
    await dialog.updateComplete;

    fireEvent(
      dialog.shadowRoot!.querySelector('dialog')!,
      new Event('cancel', { cancelable: true }),
    );

    expect(dialog.open).toBe(false);
    expect(listener.mock.calls[0][0].detail).toEqual({ reason: 'escape' });
  });

  it('closes menus after a typed item selection', async () => {
    const menu = document.createElement('ds-menu') as DsMenu;
    const item = document.createElement('ds-menu-item');
    item.value = 'export';
    item.textContent = 'Export';
    menu.append(item);
    const listener = vi.fn();
    item.addEventListener('ds-menu-select', listener);
    await mount(menu);

    fireEvent.click(menu.shadowRoot!.querySelector('.trigger')!);
    await menu.updateComplete;
    expect(menu.open).toBe(true);
    fireEvent.click(item);
    await menu.updateComplete;

    expect(menu.open).toBe(false);
    expect(listener.mock.calls[0][0].detail).toEqual({ value: 'export' });
  });

  it('clamps pagination and emits the selected page', async () => {
    const pagination = (await mount(document.createElement('ds-pagination'))) as DsPagination;
    pagination.page = 3;
    pagination.pages = 8;
    const listener = vi.fn();
    pagination.addEventListener('ds-page-change', listener);
    await pagination.updateComplete;
    fireEvent.click(pagination.shadowRoot!.querySelector('[part=next]')!);

    expect(pagination.page).toBe(4);
    expect(listener.mock.calls[0][0].detail).toEqual({ page: 4 });
  });

  it('dismisses persistent toast notifications', async () => {
    const toast = await mount(document.createElement('ds-toast'));
    toast.duration = 0;
    toast.heading = 'Saved';
    const listener = vi.fn();
    toast.addEventListener('ds-toast-close', listener);
    await toast.updateComplete;
    fireEvent.click(toast.shadowRoot!.querySelector('button')!);

    expect(toast.open).toBe(false);
    expect(listener.mock.calls[0][0].detail).toEqual({ reason: 'dismiss' });
  });
});
