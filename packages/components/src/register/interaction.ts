import { defineComponent } from '../core/ds-element.js';
import { DsDisclosure, DsTab, DsTabs, DsThemeToggle } from '../components/interaction.js';

defineComponent('ds-theme-toggle', DsThemeToggle);
defineComponent('ds-tabs', DsTabs);
defineComponent('ds-tab', DsTab);
defineComponent('ds-disclosure', DsDisclosure);

export { DsDisclosure, DsTab, DsTabs, DsThemeToggle };
export type {
  DsDisclosureChangeDetail,
  DsTabChangeDetail,
  DsTheme,
  DsThemeChangeDetail,
} from '../components/interaction.js';
