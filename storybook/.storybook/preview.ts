import type { Decorator, Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@endeavoury/kanosis';
import '@endeavoury/kanosis/styles.css';

const withTheme: Decorator = (story, context) => {
  const theme = String(context.globals['theme'] ?? 'system');
  const contrast = String(context.globals['contrast'] ?? 'standard');
  const brand = String(context.globals['brand'] ?? 'default');
  const direction = String(context.globals['direction'] ?? 'ltr');
  const fullscreen = context.parameters['layout'] === 'fullscreen';
  document.documentElement.dataset['dsTheme'] = theme;
  document.documentElement.dataset['dsContrast'] = contrast;
  document.documentElement.dataset['dsBrand'] = brand;
  document.documentElement.dir = direction;
  return html`<div
    data-ds-theme=${theme}
    data-ds-contrast=${contrast}
    data-ds-brand=${brand}
    dir=${direction}
    style=${
      fullscreen
        ? 'width:100%;height:100dvh;min-width:0;min-height:0;overflow:hidden;color:var(--ds-color-text-primary);background:var(--ds-color-bg-canvas)'
        : 'min-height:100%;color:var(--ds-color-text-primary);background:var(--ds-color-bg-canvas);padding:1.5rem'
    }
  >
    ${story()}
  </div>`;
};
const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Design-system theme',
      defaultValue: 'system',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
    contrast: {
      description: 'Contrast preference',
      defaultValue: 'standard',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'standard', title: 'Standard contrast' },
          { value: 'more', title: 'Increased contrast' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Semantic brand theme',
      defaultValue: 'default',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'default', title: 'Default brand' },
          { value: 'finance', title: 'Finance brand' },
          { value: 'ontology', title: 'Ontology brand' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Writing direction',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Foundation', 'Components', 'Patterns'],
      },
    },
    controls: { expanded: true },
    a11y: { test: 'error' },
    viewport: {
      options: {
        compact: { name: 'Compact', styles: { width: '390px', height: '844px' } },
        medium: { name: 'Medium', styles: { width: '768px', height: '1024px' } },
        expanded: { name: 'Expanded', styles: { width: '900px', height: '800px' } },
        wide: { name: 'Wide', styles: { width: '1100px', height: '900px' } },
      },
    },
  },
};
export default preview;
