import { defineComponent } from '../core/ds-element.js';
import {
  DsContainer,
  DsDetailSidebar,
  DsGrid,
  DsInline,
  DsPageHeader,
  DsStack,
} from '../components/layout.js';
defineComponent('ds-stack', DsStack);
defineComponent('ds-inline', DsInline);
defineComponent('ds-grid', DsGrid);
defineComponent('ds-container', DsContainer);
defineComponent('ds-page-header', DsPageHeader);
defineComponent('ds-detail-sidebar', DsDetailSidebar);
export { DsContainer, DsDetailSidebar, DsGrid, DsInline, DsPageHeader, DsStack };
