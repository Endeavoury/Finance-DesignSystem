import { defineComponent } from '../core/ds-element.js';
import {
  DsBulkActions,
  DsColumnManager,
  DsCombobox,
  DsDataGrid,
  DsFilterBuilder,
  DsSavedView,
  DsValidationSummary,
  DsViewToolbar,
} from '../components/enterprise.js';

defineComponent('ds-data-grid', DsDataGrid);
defineComponent('ds-filter-builder', DsFilterBuilder);
defineComponent('ds-view-toolbar', DsViewToolbar);
defineComponent('ds-column-manager', DsColumnManager);
defineComponent('ds-bulk-actions', DsBulkActions);
defineComponent('ds-saved-view', DsSavedView);
defineComponent('ds-combobox', DsCombobox);
defineComponent('ds-validation-summary', DsValidationSummary);

export {
  DsBulkActions,
  DsColumnManager,
  DsCombobox,
  DsDataGrid,
  DsFilterBuilder,
  DsSavedView,
  DsValidationSummary,
  DsViewToolbar,
};
export type {
  DsColumnOption,
  DsComboOption,
  DsFilterField,
  DsFilterRule,
  DsSavedViewOption,
  DsValidationError,
} from '../components/enterprise.js';
