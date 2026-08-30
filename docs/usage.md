# Component usage

## Registration and imports

The full entry point registers all custom elements:

```ts
import '@endeavoury/finance-design';
import '@endeavoury/finance-design/styles.css';
```

Group entry points (`button`, `forms`, `secondary-forms`, `display`, `feedback`, `interaction`, `overlays`, `upload`, `data-table`, `layout`, `navigation`, `navigation-extras`, and `patterns`) register related elements. The broad `forms` and `navigation` entries include their secondary components; the narrower entries support fine-grained loading. `@endeavoury/finance-design/classes` exports the classes without registering them, which is useful for controlled registries and testing.

## Attributes, properties, slots, and events

Use attributes for simple serializable values and properties for structured values:

```ts
import '@endeavoury/finance-design/data-table';

const table = document.querySelector('ds-data-table');
table.columns = [{ key: 'name', label: 'Name', sortable: true }];
table.rows = [{ id: '1', name: 'Main account' }];
table.addEventListener('ds-sort', (event) => console.log(event.detail));
```

All design-system custom events use the `ds-` prefix, bubble, cross Shadow DOM boundaries (`composed: true`), and expose a typed `detail`. Native slots are preferred for composable content. Stable styling hooks are selectively exposed through `::part`; internal DOM is not an API.

## Forms

`ds-input`, `ds-search-input`, `ds-textarea`, `ds-select`, `ds-checkbox`, `ds-switch`, `ds-range`, and `ds-radio-group` use `ElementInternals` and participate in native forms. They support `name`, value/checked state, disabled state, required validation where appropriate, reset, labels, keyboard interaction, and `FormData` submission.

```html
<form id="profile">
  <ds-input label="Name" name="name" required></ds-input>
  <ds-checkbox name="active" value="yes">Active</ds-checkbox>
</form>
```

`ds-drop-zone` accepts files through its native picker or drag and drop. It emits accepted files through `ds-files` and rejected files through `ds-file-reject` with a `type` or `limit` reason. File processing and uploads remain application concerns.

```html
<ds-drop-zone
  label="Choose or drop statements"
  hint="CAMT XML or ZIP"
  accept=".xml,.zip,application/xml,application/zip"
  max-files="10"
  multiple
></ds-drop-zone>
```

## Theme and interaction

`ds-theme-toggle` writes `data-ds-theme` to the document root. Set `storage-key` to persist the preference. Applications should still apply the stored value in the document head to avoid a theme flash before components load.

```html
<ds-theme-toggle theme="dark" storage-key="product-theme"></ds-theme-toggle>
```

Tabs use a parent value and slotted panels. Arrow keys, Home, and End move selection while disabled tabs are skipped.

```html
<ds-tabs label="Account views" value="activity">
  <ds-tab value="activity" label="Activity">Recent activity</ds-tab>
  <ds-tab value="details" label="Details">Account details</ds-tab>
</ds-tabs>
```

Use `ds-disclosure` for expandable inline content, `ds-progress` for task progress, and `ds-skeleton` for layout-preserving loading placeholders.

## Overlays and transient feedback

`ds-dialog` uses the native dialog top layer and returns focus when it closes. `ds-drawer` shares the same API with a start/end side-panel presentation. Both emit `ds-close` with a `button`, `escape`, `backdrop`, or `programmatic` reason.

```html
<ds-dialog heading="Delete connection?" description="This cannot be undone.">
  Imported records remain available.
  <ds-inline slot="footer">
    <ds-button variant="secondary">Cancel</ds-button>
    <ds-button variant="danger">Delete</ds-button>
  </ds-inline>
</ds-dialog>
```

Use `ds-menu`/`ds-menu-item` for action menus, `ds-tooltip` only for supplemental information, and `ds-toast-region`/`ds-toast` for transient notifications. Set a toast duration of `0` for persistent messages.

## Navigation and collections

Breadcrumbs, pagination, and list items use controlled values and typed events. Pagination emits `ds-page-change`; interactive list items emit `ds-list-activate`.

```html
<ds-breadcrumbs label="Current location">
  <ds-breadcrumb href="/accounts">Accounts</ds-breadcrumb>
  <ds-breadcrumb current>Daily account</ds-breadcrumb>
</ds-breadcrumbs>
<ds-pagination page="3" pages="18"></ds-pagination>
```

## React

The optional React package wraps the existing element classes with `@lit/react`. It adds JSX property and typed custom-event ergonomics; it does not render a second implementation.

```tsx
import { Button, Input } from '@endeavoury/finance-design-react';

export function Editor() {
  return <Input label="Name" onDsChange={(event) => console.log(event.detail.value)} />;
}
```

## Angular

Import the design-system registration once and add the exported schema to a standalone component or NgModule that uses the elements:

```ts
import '@endeavoury/finance-design';
import { FINANCE_DESIGN_CUSTOM_ELEMENTS_SCHEMA } from '@endeavoury/finance-design-angular';

@Component({
  standalone: true,
  schemas: [FINANCE_DESIGN_CUSTOM_ELEMENTS_SCHEMA],
  template: `<ds-button (ds-activate)="handle($event)">Save</ds-button>`,
})
export class ExampleComponent {}
```

Use property binding for objects: `<ds-data-table [columns]="columns" [rows]="rows" />`. Native forms work directly; Angular form-control adapters can be introduced later as thin ControlValueAccessor directives without moving behavior or styles out of the Web Components.

## Vanilla JavaScript

No framework is required. See `examples/vanilla`; the React and Angular directories provide buildable equivalents.
