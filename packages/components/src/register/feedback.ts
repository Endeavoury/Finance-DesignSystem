import { defineComponent } from '../core/ds-element.js';
import {
  DsAlert,
  DsEmptyState,
  DsLoadingState,
  DsProgress,
  DsSkeleton,
  DsToast,
  DsToastRegion,
} from '../components/feedback.js';
defineComponent('ds-alert', DsAlert);
defineComponent('ds-empty-state', DsEmptyState);
defineComponent('ds-loading-state', DsLoadingState);
defineComponent('ds-progress', DsProgress);
defineComponent('ds-skeleton', DsSkeleton);
defineComponent('ds-toast', DsToast);
defineComponent('ds-toast-region', DsToastRegion);
export { DsAlert, DsEmptyState, DsLoadingState, DsProgress, DsSkeleton, DsToast, DsToastRegion };
