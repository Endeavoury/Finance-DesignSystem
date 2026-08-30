import type { DsButton, DsButtonGroup, DsIconButton } from './components/button.js';
import type { DsIcon } from './components/icon.js';
import type {
  DsCheckbox,
  DsFormField,
  DsInput,
  DsSearchInput,
  DsSelect,
} from './components/forms.js';
import type {
  DsRadio,
  DsRadioGroup,
  DsRange,
  DsSwitch,
  DsTextarea,
} from './components/secondary-forms.js';
import type {
  DsAvatar,
  DsBadge,
  DsCard,
  DsCodeBlock,
  DsDescriptionList,
  DsMetric,
  DsPanel,
  DsStatusBadge,
} from './components/display.js';
import type {
  DsAlert,
  DsEmptyState,
  DsLoadingState,
  DsProgress,
  DsSkeleton,
  DsToast,
  DsToastRegion,
} from './components/feedback.js';
import type { DsDisclosure, DsTab, DsTabs, DsThemeToggle } from './components/interaction.js';
import type { DsDialog, DsDrawer, DsMenu, DsMenuItem, DsTooltip } from './components/overlays.js';
import type { DsDropZone } from './components/upload.js';
import type { DsDataTable } from './components/data-table.js';
import type {
  DsContainer,
  DsDetailSidebar,
  DsGrid,
  DsInline,
  DsPageHeader,
  DsStack,
} from './components/layout.js';
import type { DsAppShell, DsSidebar, DsSidebarItem } from './components/navigation.js';
import type {
  DsBreadcrumb,
  DsBreadcrumbs,
  DsList,
  DsListItem,
  DsPagination,
} from './components/navigation-extras.js';
import type { DsFilterBar, DsKpiGrid } from './components/patterns.js';
import type { DsTree, DsTreeItem } from './components/tree.js';

declare global {
  interface HTMLElementTagNameMap {
    'ds-icon': DsIcon;
    'ds-button': DsButton;
    'ds-icon-button': DsIconButton;
    'ds-button-group': DsButtonGroup;
    'ds-input': DsInput;
    'ds-search-input': DsSearchInput;
    'ds-select': DsSelect;
    'ds-checkbox': DsCheckbox;
    'ds-form-field': DsFormField;
    'ds-textarea': DsTextarea;
    'ds-switch': DsSwitch;
    'ds-range': DsRange;
    'ds-radio-group': DsRadioGroup;
    'ds-radio': DsRadio;
    'ds-badge': DsBadge;
    'ds-status-badge': DsStatusBadge;
    'ds-avatar': DsAvatar;
    'ds-card': DsCard;
    'ds-code-block': DsCodeBlock;
    'ds-description-list': DsDescriptionList;
    'ds-panel': DsPanel;
    'ds-metric': DsMetric;
    'ds-alert': DsAlert;
    'ds-loading-state': DsLoadingState;
    'ds-empty-state': DsEmptyState;
    'ds-progress': DsProgress;
    'ds-skeleton': DsSkeleton;
    'ds-toast': DsToast;
    'ds-toast-region': DsToastRegion;
    'ds-theme-toggle': DsThemeToggle;
    'ds-tabs': DsTabs;
    'ds-tab': DsTab;
    'ds-disclosure': DsDisclosure;
    'ds-dialog': DsDialog;
    'ds-drawer': DsDrawer;
    'ds-menu': DsMenu;
    'ds-menu-item': DsMenuItem;
    'ds-tooltip': DsTooltip;
    'ds-drop-zone': DsDropZone;
    'ds-data-table': DsDataTable;
    'ds-stack': DsStack;
    'ds-inline': DsInline;
    'ds-grid': DsGrid;
    'ds-container': DsContainer;
    'ds-page-header': DsPageHeader;
    'ds-detail-sidebar': DsDetailSidebar;
    'ds-app-shell': DsAppShell;
    'ds-sidebar': DsSidebar;
    'ds-sidebar-item': DsSidebarItem;
    'ds-breadcrumbs': DsBreadcrumbs;
    'ds-breadcrumb': DsBreadcrumb;
    'ds-pagination': DsPagination;
    'ds-list': DsList;
    'ds-list-item': DsListItem;
    'ds-filter-bar': DsFilterBar;
    'ds-kpi-grid': DsKpiGrid;
    'ds-tree': DsTree;
    'ds-tree-item': DsTreeItem;
  }
}

export {};
