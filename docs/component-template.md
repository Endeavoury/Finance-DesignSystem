# Component documentation template

Use this template for every component promoted to **ready**.

## Summary

- Tag and class:
- Status and owner:
- Problem solved:
- When to use:
- When not to use:
- Related components and patterns:

## Anatomy and content

Describe each visible part, slot, label, icon, message, and action. Include writing guidance,
localization constraints, empty values, long values, and numeric formatting when relevant.

## Public contract

| Name | Kind | Type/default | Purpose |
| --- | --- | --- | --- |
| | Attribute/property/event/slot/part | | |

Events must bubble and cross Shadow DOM. Describe whether the component is controlled, whether it
updates its own state, and how forms receive values.

## State matrix

Document enabled, hover, focus, pressed, selected, loading, error, disabled, read-only, empty, and
high-volume states as applicable. Important states use at least two cues; color alone is insufficient.

## Interaction

Describe pointer, keyboard, touch, screen-reader, focus-entry, focus-return, cancellation, and
async-update behavior. Include a keyboard table for composite widgets.

## Responsive and international behavior

Specify compact, medium, expanded, and wide behavior. Cover reflow, scroll ownership, 200% text size,
400% zoom, text spacing, RTL, long labels, and translated content.

## Accessibility ownership

Separate behavior built into the component from responsibilities retained by the consumer, such as
providing a unique label, row identity, meaningful error copy, or post-request focus placement.

## Theming and customization

List supported semantic tokens, slots, CSS parts, density modes, contrast/forced-color behavior, and
examples. Undocumented Shadow DOM selectors are never supported.

## Availability and evidence

Link Penpot component, Storybook examples, tests, framework adapters, bundle entry point, release
version, known limitations, and migration notes.
