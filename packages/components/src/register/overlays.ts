import { defineComponent } from '../core/ds-element.js';
import { DsDialog, DsDrawer, DsMenu, DsMenuItem, DsTooltip } from '../components/overlays.js';

defineComponent('ds-dialog', DsDialog);
defineComponent('ds-drawer', DsDrawer);
defineComponent('ds-menu', DsMenu);
defineComponent('ds-menu-item', DsMenuItem);
defineComponent('ds-tooltip', DsTooltip);

export { DsDialog, DsDrawer, DsMenu, DsMenuItem, DsTooltip };
