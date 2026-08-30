import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { fireEvent } from '@testing-library/dom';
import { Button, DescriptionList, Input, ThemeToggle, Tree, TreeItem } from '@endeavoury/kanosis-react';
import { describe, expect, it, vi } from 'vitest';

describe('React adapter', () => {
  it('renders the real element and maps properties, children, and typed events', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const onChange = vi.fn();
    await act(async () => {
      root.render(
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Input, { label: 'Name', value: 'React value', onDsChange: onChange }),
          React.createElement(Button, { variant: 'secondary' }, 'Save'),
        ),
      );
    });
    const input = container.querySelector('ds-input')!;
    const button = container.querySelector('ds-button')!;
    await Promise.all([input.updateComplete, button.updateComplete]);
    expect(input.value).toBe('React value');
    expect(button.textContent).toBe('Save');
    input.dispatchEvent(
      new CustomEvent('ds-change', { detail: { value: 'Updated' }, bubbles: true, composed: true }),
    );
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 'Updated' });
    await act(async () => root.unmount());
  });

  it('maps new interaction events without replacing the custom element', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const onThemeChange = vi.fn();
    await act(async () => {
      root.render(
        React.createElement(ThemeToggle, { theme: 'dark', onDsThemeChange: onThemeChange }),
      );
    });
    const toggle = container.querySelector('ds-theme-toggle')!;
    await toggle.updateComplete;
    fireEvent.click(toggle.shadowRoot!.querySelector('button')!);
    expect(onThemeChange.mock.calls[0][0].detail).toEqual({ theme: 'light' });
    await act(async () => root.unmount());
  });

  it('maps cross-product metadata and tree navigation to the same custom elements', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const onActivate = vi.fn();
    await act(async () => {
      root.render(React.createElement(React.Fragment, null,
        React.createElement(DescriptionList, { items: [{ term: 'Node', value: 'Commercial' }] }),
        React.createElement(Tree, { label: 'Systems' },
          React.createElement(TreeItem, { label: 'Commercial', value: 'commercial', onDsTreeActivate: onActivate })),
      ));
    });
    const descriptions = container.querySelector('ds-description-list')!;
    const item = container.querySelector('ds-tree-item')!;
    await Promise.all([descriptions.updateComplete, item.updateComplete]);
    fireEvent.click(item.shadowRoot!.querySelector('button')!);
    expect(descriptions.items[0]).toEqual({ term: 'Node', value: 'Commercial' });
    expect(onActivate.mock.calls[0][0].detail).toEqual({ value: 'commercial' });
    await act(async () => root.unmount());
  });
});
