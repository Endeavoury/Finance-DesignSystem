import { defineComponent } from '../core/ds-element.js';
import {
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
} from '../components/enhancements.js';

defineComponent('ds-live-region', DsLiveRegion);
defineComponent('ds-segmented-control', DsSegmentedControl);
defineComponent('ds-segment', DsSegment);
defineComponent('ds-action-bar', DsActionBar);
defineComponent('ds-split-button', DsSplitButton);
defineComponent('ds-input-group', DsInputGroup);
defineComponent('ds-chip', DsChip);
defineComponent('ds-illustration', DsIllustration);
defineComponent('ds-brand-mark', DsBrandMark);
defineComponent('ds-reorder-list', DsReorderList);
defineComponent('ds-reorder-item', DsReorderItem);

export {
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
};
export type {
  DsDismissValueDetail,
  DsReorderDetail,
  DsValueDetail,
} from '../components/enhancements.js';
