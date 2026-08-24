import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@finance-design/design-system';

export const FINANCE_DESIGN_CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
export const DESIGN_SYSTEM_SCHEMAS = [FINANCE_DESIGN_CUSTOM_ELEMENTS_SCHEMA] as const;
export function registerDesignSystem(): void {
  // Importing this package registers the same Web Components used by every consumer.
}
