import { defineComponent } from '../core/ds-element.js';
import {
  DsContainer,
  DsDetailSidebar,
  DsGrid,
  DsInline,
  DsInspectorPane,
  DsPane,
  DsPaneContent,
  DsPaneGroup,
  DsPaneHeader,
  DsPageHeader,
  DsScrollablePane,
  DsStack,
} from '../components/layout.js';
defineComponent('ds-stack', DsStack);
defineComponent('ds-inline', DsInline);
defineComponent('ds-grid', DsGrid);
defineComponent('ds-container', DsContainer);
defineComponent('ds-page-header', DsPageHeader);
defineComponent('ds-detail-sidebar', DsDetailSidebar);
defineComponent('ds-pane-group', DsPaneGroup);
defineComponent('ds-pane', DsPane);
defineComponent('ds-scrollable-pane', DsScrollablePane);
defineComponent('ds-pane-header', DsPaneHeader);
defineComponent('ds-pane-content', DsPaneContent);
defineComponent('ds-inspector-pane', DsInspectorPane);
export {
  DsContainer,
  DsDetailSidebar,
  DsGrid,
  DsInline,
  DsInspectorPane,
  DsPane,
  DsPaneContent,
  DsPaneGroup,
  DsPaneHeader,
  DsPageHeader,
  DsScrollablePane,
  DsStack,
};
