import { defineComponent } from '../core/ds-element.js';
import {
  DsBanner,
  DsCommandPalette,
  DsContextMenu,
  DsDetailList,
  DsGlobalSearch,
  DsNavigationGroup,
  DsNotificationCenter,
  DsQuickActions,
  DsRecordHeader,
  DsTenantSwitcher,
  DsUserMenu,
  DsWorkspaceTabs,
} from '../components/enterprise-p1.js';

defineComponent('ds-command-palette', DsCommandPalette);
defineComponent('ds-global-search', DsGlobalSearch);
defineComponent('ds-tenant-switcher', DsTenantSwitcher);
defineComponent('ds-user-menu', DsUserMenu);
defineComponent('ds-workspace-tabs', DsWorkspaceTabs);
defineComponent('ds-navigation-group', DsNavigationGroup);
defineComponent('ds-context-menu', DsContextMenu);
defineComponent('ds-quick-actions', DsQuickActions);
defineComponent('ds-record-header', DsRecordHeader);
defineComponent('ds-detail-list', DsDetailList);
defineComponent('ds-notification-center', DsNotificationCenter);
defineComponent('ds-banner', DsBanner);

export {
  DsBanner,
  DsCommandPalette,
  DsContextMenu,
  DsDetailList,
  DsGlobalSearch,
  DsNavigationGroup,
  DsNotificationCenter,
  DsQuickActions,
  DsRecordHeader,
  DsTenantSwitcher,
  DsUserMenu,
  DsWorkspaceTabs,
};
export type {
  DsCommand,
  DsDetailItem,
  DsNotification,
  DsTenant,
  DsWorkspaceTab,
} from '../components/enterprise-p1.js';
