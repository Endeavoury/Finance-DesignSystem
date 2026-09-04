# Saving, forms, validation, and undo

## Choose a saving model

Use **explicit saving** for text input, multi-field forms, checkbox/radio groups, native selects, and
changes that can fail validation. One form gets one clearly associated submit action. Enter submits
when native form behavior allows it. Never mix explicit and automatic saving inside one form.

Use **automatic saving** for imperative controls whose result is immediate and reversible, such as a
standalone switch or segmented view control. Update optimistically only when rollback is safe; report
failure next to the control and restore the prior value.

## Request lifecycle

1. Keep values and focus stable while validating.
2. Move focus to `ds-validation-summary` only after a failed explicit submit when doing so helps the
   user find multiple errors.
3. Disable duplicate submission, but do not make the form unreadable.
4. Preserve all input on server failure and use the messaging pattern appropriate to its scope.
5. On success, show feedback only if the result is not already obvious.
6. Warn before navigation when meaningful unsaved work would be lost.

Destructive actions use a clear verb, confirmation proportional to risk, and an undo path whenever
the operation is technically reversible. Avoid confirmations for low-risk reversible changes.

Settings pages should use `ds-form-section`, `ds-form-field`, form-associated controls,
`ds-validation-summary`, and an `ds-action-bar` placed consistently after the form.
