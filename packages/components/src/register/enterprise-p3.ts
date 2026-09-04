import { defineComponent } from '../core/ds-element.js';
import {
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
} from '../components/enterprise-p3.js';
defineComponent('ds-audit-log', DsAuditLog);
defineComponent('ds-permission-matrix', DsPermissionMatrix);
defineComponent('ds-role-badge', DsRoleBadge);
defineComponent('ds-diff-viewer', DsDiffViewer);
defineComponent('ds-code-editor', DsCodeEditor);
defineComponent('ds-json-editor', DsJsonEditor);
defineComponent('ds-maintenance-notice', DsMaintenanceNotice);
defineComponent('ds-help-panel', DsHelpPanel);
defineComponent('ds-tour', DsTour);
defineComponent('ds-coachmark', DsCoachmark);
defineComponent('ds-compare-view', DsCompareView);
export {
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
};
export type {
  DsAuditEntry,
  DsDiffLine,
  DsPermission,
  DsPermissionRole,
  DsTourStep,
} from '../components/enterprise-p3.js';
