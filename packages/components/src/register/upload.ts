import { defineComponent } from '../core/ds-element.js';
import { DsDropZone } from '../components/upload.js';

defineComponent('ds-drop-zone', DsDropZone);

export { DsDropZone };
export type { DsFileRejectDetail, DsFilesDetail } from '../components/upload.js';
