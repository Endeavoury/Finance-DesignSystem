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
  DsInspectorPane,
  DsPane,
  DsPaneContent,
  DsPaneGroup,
  DsPaneHeader,
  DsPageHeader,
  DsScrollablePane,
  DsStack,
} from './components/layout.js';
import type { DsAppShell, DsSidebar, DsSidebarItem } from './components/navigation.js';
import type {
  DsBulkActions,
  DsColumnManager,
  DsCombobox,
  DsDataGrid,
  DsFilterBuilder,
  DsSavedView,
  DsValidationSummary,
  DsViewToolbar,
} from './components/enterprise.js';
import type {
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
} from './components/enterprise-p1.js';
import type {
  DsActivityFeed,
  DsApprovalFlow,
  DsChangeSummary,
  DsDatePicker,
  DsFieldArray,
  DsFileUpload,
  DsFormSection,
  DsJobStatus,
  DsStepper,
  DsTaskList,
  DsTimePicker,
  DsTimeline,
} from './components/enterprise-p2.js';
import type {
  DsAuditLog,
  DsPermissionMatrix,
  DsRoleBadge,
  DsDiffViewer,
  DsCodeEditor,
  DsJsonEditor,
  DsMaintenanceNotice,
  DsHelpPanel,
  DsTour,
  DsCoachmark,
  DsCompareView,
} from './components/enterprise-p3.js';
import type {
  DsBreadcrumb,
  DsBreadcrumbs,
  DsList,
  DsListItem,
  DsPagination,
} from './components/navigation-extras.js';
import type { DsFilterBar, DsKpiGrid } from './components/patterns.js';
import type { DsTree, DsTreeItem } from './components/tree.js';
import type {
  DsActionBar,
  DsBrandMark,
  DsChip,
  DsIllustration,
  DsInputGroup,
  DsLiveRegion,
  DsReorderItem,
  DsReorderList,
  DsSegment,
  DsSegmentedControl,
  DsSplitButton,
} from './components/enhancements.js';

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
    'ds-pane-group': DsPaneGroup;
    'ds-pane': DsPane;
    'ds-scrollable-pane': DsScrollablePane;
    'ds-pane-header': DsPaneHeader;
    'ds-pane-content': DsPaneContent;
    'ds-inspector-pane': DsInspectorPane;
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
    'ds-data-grid': DsDataGrid;
    'ds-filter-builder': DsFilterBuilder;
    'ds-view-toolbar': DsViewToolbar;
    'ds-column-manager': DsColumnManager;
    'ds-bulk-actions': DsBulkActions;
    'ds-saved-view': DsSavedView;
    'ds-combobox': DsCombobox;
    'ds-validation-summary': DsValidationSummary;
    'ds-command-palette': DsCommandPalette;
    'ds-global-search': DsGlobalSearch;
    'ds-tenant-switcher': DsTenantSwitcher;
    'ds-user-menu': DsUserMenu;
    'ds-workspace-tabs': DsWorkspaceTabs;
    'ds-navigation-group': DsNavigationGroup;
    'ds-context-menu': DsContextMenu;
    'ds-quick-actions': DsQuickActions;
    'ds-record-header': DsRecordHeader;
    'ds-detail-list': DsDetailList;
    'ds-notification-center': DsNotificationCenter;
    'ds-banner': DsBanner;
    'ds-form-section': DsFormSection;
    'ds-field-array': DsFieldArray;
    'ds-date-picker': DsDatePicker;
    'ds-time-picker': DsTimePicker;
    'ds-file-upload': DsFileUpload;
    'ds-stepper': DsStepper;
    'ds-approval-flow': DsApprovalFlow;
    'ds-task-list': DsTaskList;
    'ds-timeline': DsTimeline;
    'ds-activity-feed': DsActivityFeed;
    'ds-job-status': DsJobStatus;
    'ds-change-summary': DsChangeSummary;
    'ds-audit-log': DsAuditLog;
    'ds-permission-matrix': DsPermissionMatrix;
    'ds-role-badge': DsRoleBadge;
    'ds-diff-viewer': DsDiffViewer;
    'ds-code-editor': DsCodeEditor;
    'ds-json-editor': DsJsonEditor;
    'ds-maintenance-notice': DsMaintenanceNotice;
    'ds-help-panel': DsHelpPanel;
    'ds-tour': DsTour;
    'ds-coachmark': DsCoachmark;
    'ds-compare-view': DsCompareView;
    'ds-live-region': DsLiveRegion;
    'ds-segmented-control': DsSegmentedControl;
    'ds-segment': DsSegment;
    'ds-action-bar': DsActionBar;
    'ds-split-button': DsSplitButton;
    'ds-input-group': DsInputGroup;
    'ds-chip': DsChip;
    'ds-illustration': DsIllustration;
    'ds-brand-mark': DsBrandMark;
    'ds-reorder-list': DsReorderList;
    'ds-reorder-item': DsReorderItem;
  }
}

export {};
