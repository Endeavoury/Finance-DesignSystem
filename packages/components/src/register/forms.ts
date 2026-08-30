import { defineComponent } from '../core/ds-element.js';
import { DsCheckbox, DsFormField, DsInput, DsSearchInput, DsSelect } from '../components/forms.js';
import {
  DsRadio,
  DsRadioGroup,
  DsRange,
  DsSwitch,
  DsTextarea,
} from '../components/secondary-forms.js';
defineComponent('ds-input', DsInput);
defineComponent('ds-search-input', DsSearchInput);
defineComponent('ds-select', DsSelect);
defineComponent('ds-checkbox', DsCheckbox);
defineComponent('ds-form-field', DsFormField);
defineComponent('ds-textarea', DsTextarea);
defineComponent('ds-switch', DsSwitch);
defineComponent('ds-range', DsRange);
defineComponent('ds-radio-group', DsRadioGroup);
defineComponent('ds-radio', DsRadio);
export {
  DsCheckbox,
  DsFormField,
  DsInput,
  DsRadio,
  DsRadioGroup,
  DsRange,
  DsSearchInput,
  DsSelect,
  DsSwitch,
  DsTextarea,
};
