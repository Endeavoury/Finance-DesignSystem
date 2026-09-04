import { defineComponent } from '../core/ds-element.js';
import {
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
} from '../components/enterprise-p2.js';
defineComponent('ds-form-section', DsFormSection);
defineComponent('ds-field-array', DsFieldArray);
defineComponent('ds-date-picker', DsDatePicker);
defineComponent('ds-time-picker', DsTimePicker);
defineComponent('ds-file-upload', DsFileUpload);
defineComponent('ds-stepper', DsStepper);
defineComponent('ds-approval-flow', DsApprovalFlow);
defineComponent('ds-task-list', DsTaskList);
defineComponent('ds-timeline', DsTimeline);
defineComponent('ds-activity-feed', DsActivityFeed);
defineComponent('ds-job-status', DsJobStatus);
defineComponent('ds-change-summary', DsChangeSummary);
export {
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
};
export type {
  DsActivityItem,
  DsChangeItem,
  DsFieldItem,
  DsStep,
  DsTask,
  DsTimelineItem,
} from '../components/enterprise-p2.js';
