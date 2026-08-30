import { defineComponent } from '../core/ds-element.js';
import { DsIcon } from '../components/icon.js';
import { DsAppShell, DsSidebar, DsSidebarItem } from '../components/navigation.js';
import {
  DsBreadcrumb,
  DsBreadcrumbs,
  DsList,
  DsListItem,
  DsPagination,
} from '../components/navigation-extras.js';
defineComponent('ds-icon', DsIcon);
defineComponent('ds-app-shell', DsAppShell);
defineComponent('ds-sidebar', DsSidebar);
defineComponent('ds-sidebar-item', DsSidebarItem);
defineComponent('ds-breadcrumbs', DsBreadcrumbs);
defineComponent('ds-breadcrumb', DsBreadcrumb);
defineComponent('ds-pagination', DsPagination);
defineComponent('ds-list', DsList);
defineComponent('ds-list-item', DsListItem);
export {
  DsIcon,
  DsAppShell,
  DsBreadcrumb,
  DsBreadcrumbs,
  DsList,
  DsListItem,
  DsPagination,
  DsSidebar,
  DsSidebarItem,
};
