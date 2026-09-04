import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import '@endeavoury/kanosis';
import {
  DsAlert,
  DsAppShell,
  DsAvatar,
  DsBadge,
  DsButton,
  DsButtonGroup,
  DsBreadcrumb,
  DsBreadcrumbs,
  DsCard,
  DsCodeBlock,
  DsCheckbox,
  DsContainer,
  DsDataTable,
  DsDescriptionList,
  DsDetailSidebar,
  DsDialog,
  DsDisclosure,
  DsDropZone,
  DsDrawer,
  DsEmptyState,
  DsFilterBar,
  DsFormField,
  DsGrid,
  DsIcon,
  DsIconButton,
  DsInline,
  DsInspectorPane,
  DsInput,
  DsKpiGrid,
  DsLoadingState,
  DsList,
  DsListItem,
  DsMenu,
  DsMenuItem,
  DsMetric,
  DsPageHeader,
  DsPane,
  DsPaneContent,
  DsPaneGroup,
  DsPaneHeader,
  DsPanel,
  DsPagination,
  DsRadio,
  DsRadioGroup,
  DsRange,
  DsSearchInput,
  DsSelect,
  DsSidebar,
  DsSidebarItem,
  DsScrollablePane,
  DsStack,
  DsStatusBadge,
  DsSwitch,
  DsTab,
  DsTabs,
  DsThemeToggle,
  DsTextarea,
  DsToast,
  DsToastRegion,
  DsTooltip,
  DsTree,
  DsTreeItem,
  DsProgress,
  DsSkeleton,
  type DsActivateDetail,
  type DsCheckedChangeDetail,
  type DsDisclosureChangeDetail,
  type DsDismissDetail,
  type DsFileRejectDetail,
  type DsFilesDetail,
  type DsListActivateDetail,
  type DsMenuSelectDetail,
  type DsMenuToggleDetail,
  type DsPageChangeDetail,
  type DsRowSelectDetail,
  type DsSortDetail,
  type DsTabChangeDetail,
  type DsThemeChangeDetail,
  type DsTreeActivateDetail,
  type DsToastCloseDetail,
  type DsValueChangeDetail,
} from '@endeavoury/kanosis';

const component = <ElementClass extends HTMLElement>(
  tagName: string,
  elementClass: { new (): ElementClass },
) => createComponent<ElementClass>({ tagName, elementClass, react: React });
export const Icon = component('ds-icon', DsIcon);
export const Button = component('ds-button', DsButton);
export const IconButton = component('ds-icon-button', DsIconButton);
export const ButtonGroup = component('ds-button-group', DsButtonGroup);
export const Input = createComponent({
  tagName: 'ds-input',
  elementClass: DsInput,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const SearchInput = createComponent({
  tagName: 'ds-search-input',
  elementClass: DsSearchInput,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const Select = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelect,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>> },
});
export const Checkbox = createComponent({
  tagName: 'ds-checkbox',
  elementClass: DsCheckbox,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsCheckedChangeDetail>> },
});
export const FormField = component('ds-form-field', DsFormField);
export const Textarea = createComponent({
  tagName: 'ds-textarea',
  elementClass: DsTextarea,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const Switch = createComponent({
  tagName: 'ds-switch',
  elementClass: DsSwitch,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsCheckedChangeDetail>> },
});
export const Range = createComponent({
  tagName: 'ds-range',
  elementClass: DsRange,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const RadioGroup = createComponent({
  tagName: 'ds-radio-group',
  elementClass: DsRadioGroup,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>> },
});
export const Radio = component('ds-radio', DsRadio);
export const Badge = component('ds-badge', DsBadge);
export const StatusBadge = component('ds-status-badge', DsStatusBadge);
export const Avatar = component('ds-avatar', DsAvatar);
export const Card = component('ds-card', DsCard);
export const CodeBlock = component('ds-code-block', DsCodeBlock);
export const DescriptionList = component('ds-description-list', DsDescriptionList);
export const Panel = component('ds-panel', DsPanel);
export const Metric = component('ds-metric', DsMetric);
export const Alert = createComponent({
  tagName: 'ds-alert',
  elementClass: DsAlert,
  react: React,
  events: { onDsDismiss: 'ds-dismiss' as EventName<CustomEvent<void>> },
});
export const LoadingState = component('ds-loading-state', DsLoadingState);
export const EmptyState = component('ds-empty-state', DsEmptyState);
export const Progress = component('ds-progress', DsProgress);
export const Skeleton = component('ds-skeleton', DsSkeleton);
export const Toast = createComponent({
  tagName: 'ds-toast',
  elementClass: DsToast,
  react: React,
  events: {
    onDsToastClose: 'ds-toast-close' as EventName<CustomEvent<DsToastCloseDetail>>,
  },
});
export const ToastRegion = component('ds-toast-region', DsToastRegion);
export const ThemeToggle = createComponent({
  tagName: 'ds-theme-toggle',
  elementClass: DsThemeToggle,
  react: React,
  events: {
    onDsThemeChange: 'ds-theme-change' as EventName<CustomEvent<DsThemeChangeDetail>>,
  },
});
export const Tabs = createComponent({
  tagName: 'ds-tabs',
  elementClass: DsTabs,
  react: React,
  events: { onDsTabChange: 'ds-tab-change' as EventName<CustomEvent<DsTabChangeDetail>> },
});
export const Tab = component('ds-tab', DsTab);
export const Disclosure = createComponent({
  tagName: 'ds-disclosure',
  elementClass: DsDisclosure,
  react: React,
  events: {
    onDsDisclosureChange: 'ds-disclosure-change' as EventName<
      CustomEvent<DsDisclosureChangeDetail>
    >,
  },
});
export const Dialog = createComponent({
  tagName: 'ds-dialog',
  elementClass: DsDialog,
  react: React,
  events: { onDsClose: 'ds-close' as EventName<CustomEvent<DsDismissDetail>> },
});
export const Drawer = createComponent({
  tagName: 'ds-drawer',
  elementClass: DsDrawer,
  react: React,
  events: { onDsClose: 'ds-close' as EventName<CustomEvent<DsDismissDetail>> },
});
export const Menu = createComponent({
  tagName: 'ds-menu',
  elementClass: DsMenu,
  react: React,
  events: {
    onDsMenuToggle: 'ds-menu-toggle' as EventName<CustomEvent<DsMenuToggleDetail>>,
  },
});
export const MenuItem = createComponent({
  tagName: 'ds-menu-item',
  elementClass: DsMenuItem,
  react: React,
  events: {
    onDsMenuSelect: 'ds-menu-select' as EventName<CustomEvent<DsMenuSelectDetail>>,
  },
});
export const Tooltip = component('ds-tooltip', DsTooltip);
export const DropZone = createComponent({
  tagName: 'ds-drop-zone',
  elementClass: DsDropZone,
  react: React,
  events: {
    onDsFiles: 'ds-files' as EventName<CustomEvent<DsFilesDetail>>,
    onDsFileReject: 'ds-file-reject' as EventName<CustomEvent<DsFileRejectDetail>>,
  },
});
export const DataTable = createComponent({
  tagName: 'ds-data-table',
  elementClass: DsDataTable,
  react: React,
  events: {
    onDsSort: 'ds-sort' as EventName<CustomEvent<DsSortDetail>>,
    onDsRowSelect: 'ds-row-select' as EventName<CustomEvent<DsRowSelectDetail>>,
  },
});
export const Stack = component('ds-stack', DsStack);
export const Inline = component('ds-inline', DsInline);
export const Grid = component('ds-grid', DsGrid);
export const Container = component('ds-container', DsContainer);
export const PageHeader = component('ds-page-header', DsPageHeader);
export const PaneGroup = component('ds-pane-group', DsPaneGroup);
export const Pane = component('ds-pane', DsPane);
export const ScrollablePane = component('ds-scrollable-pane', DsScrollablePane);
export const PaneHeader = component('ds-pane-header', DsPaneHeader);
export const PaneContent = component('ds-pane-content', DsPaneContent);
export const InspectorPane = component('ds-inspector-pane', DsInspectorPane);
export const DetailSidebar = createComponent({
  tagName: 'ds-detail-sidebar',
  elementClass: DsDetailSidebar,
  react: React,
  events: { onDsClose: 'ds-close' as EventName<CustomEvent<void>> },
});
export const AppShell = component('ds-app-shell', DsAppShell);
export const Sidebar = component('ds-sidebar', DsSidebar);
export const SidebarItem = createComponent({
  tagName: 'ds-sidebar-item',
  elementClass: DsSidebarItem,
  react: React,
  events: { onDsActivate: 'ds-activate' as EventName<CustomEvent<DsActivateDetail>> },
});
export const Breadcrumbs = component('ds-breadcrumbs', DsBreadcrumbs);
export const Breadcrumb = component('ds-breadcrumb', DsBreadcrumb);
export const Pagination = createComponent({
  tagName: 'ds-pagination',
  elementClass: DsPagination,
  react: React,
  events: {
    onDsPageChange: 'ds-page-change' as EventName<CustomEvent<DsPageChangeDetail>>,
  },
});
export const List = component('ds-list', DsList);
export const ListItem = createComponent({
  tagName: 'ds-list-item',
  elementClass: DsListItem,
  react: React,
  events: {
    onDsListActivate: 'ds-list-activate' as EventName<CustomEvent<DsListActivateDetail>>,
  },
});
export const FilterBar = component('ds-filter-bar', DsFilterBar);
export const KpiGrid = component('ds-kpi-grid', DsKpiGrid);
export const Tree = component('ds-tree', DsTree);
export const TreeItem = createComponent({
  tagName: 'ds-tree-item',
  elementClass: DsTreeItem,
  react: React,
  events: {
    onDsTreeActivate: 'ds-tree-activate' as EventName<CustomEvent<DsTreeActivateDetail>>,
  },
});
