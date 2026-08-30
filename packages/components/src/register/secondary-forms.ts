import { defineComponent } from '../core/ds-element.js';
import {
  DsRadio,
  DsRadioGroup,
  DsRange,
  DsSwitch,
  DsTextarea,
} from '../components/secondary-forms.js';

defineComponent('ds-textarea', DsTextarea);
defineComponent('ds-switch', DsSwitch);
defineComponent('ds-range', DsRange);
defineComponent('ds-radio-group', DsRadioGroup);
defineComponent('ds-radio', DsRadio);

export { DsRadio, DsRadioGroup, DsRange, DsSwitch, DsTextarea };
