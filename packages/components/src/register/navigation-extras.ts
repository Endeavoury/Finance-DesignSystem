import { defineComponent } from '../core/ds-element.js';
import {
  DsBreadcrumb,
  DsBreadcrumbs,
  DsList,
  DsListItem,
  DsPagination,
} from '../components/navigation-extras.js';

defineComponent('ds-breadcrumbs', DsBreadcrumbs);
defineComponent('ds-breadcrumb', DsBreadcrumb);
defineComponent('ds-pagination', DsPagination);
defineComponent('ds-list', DsList);
defineComponent('ds-list-item', DsListItem);

export { DsBreadcrumb, DsBreadcrumbs, DsList, DsListItem, DsPagination };
