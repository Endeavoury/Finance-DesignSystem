import { defineComponent } from '../core/ds-element.js';
import {
  DsAvatar,
  DsBadge,
  DsCard,
  DsCodeBlock,
  DsDescriptionList,
  DsMetric,
  DsPanel,
  DsStatusBadge,
} from '../components/display.js';
defineComponent('ds-badge', DsBadge);
defineComponent('ds-status-badge', DsStatusBadge);
defineComponent('ds-avatar', DsAvatar);
defineComponent('ds-card', DsCard);
defineComponent('ds-code-block', DsCodeBlock);
defineComponent('ds-description-list', DsDescriptionList);
defineComponent('ds-panel', DsPanel);
defineComponent('ds-metric', DsMetric);
export { DsAvatar, DsBadge, DsCard, DsCodeBlock, DsDescriptionList, DsMetric, DsPanel, DsStatusBadge };
