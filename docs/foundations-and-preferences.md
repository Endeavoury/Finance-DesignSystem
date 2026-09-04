# Foundations, responsive ranges, and user preferences

## Source of truth

`packages/tokens/src/tokens.css` is the machine-readable token source. Run
`npm run tokens:generate` after changing it. The command generates exact typed metadata; the quality
gate rejects stale metadata, unknown token references, raw component colors, and raw motion durations.

## Responsive contract

| Range | Maximum | Use |
| --- | ---: | --- |
| Compact | 40rem | Single-column and touch-first arrangements |
| Medium | 48rem | Simplified two-region layouts |
| Expanded | 56.25rem | Full application navigation and two-pane work |
| Wide | 68.75rem | Optional third pane or dense analytics |

The token package exports `breakpoints`; the styles package exports `mediaCompact`, `mediaMedium`,
`mediaExpanded`, and `mediaWide` for Lit CSS. CSS custom properties expose the values for inspection,
but cannot themselves be used as media-query conditions. Component behavior should use the shared
exports and document any exception.

Prefer container queries for a component whose available inline size is independent of the viewport.
Use viewport ranges for application structure, navigation affordances, and top-level composition.

## Interaction states

Review enabled, hover, focus, pressed, selected, dragged, loading, error, disabled, and read-only
states. Focus always has a visible outline. Selection, errors, and drag placement need a second cue
such as text, iconography, border, position, or programmatic state.

Semantic motion roles are `--ds-motion-control`, `--ds-motion-popup-enter`,
`--ds-motion-popup-exit`, `--ds-motion-pane`, and `--ds-motion-update`. Reduced motion collapses all
duration tokens to 1ms.

Semantic elevation roles are surface, raised, overlay, and overflow. Use an elevation because it
communicates layering or clipped content, not as generic decoration.

## Required preference matrix

Ready components are reviewed with:

- light, dark, and system color modes;
- standard and increased contrast (`data-ds-contrast="more"` and `prefers-contrast`);
- Windows forced colors;
- reduced motion;
- browser default text-size changes, 200% text, and 400% zoom/reflow;
- WCAG text-spacing overrides;
- `dir="rtl"` and mixed-direction content;
- pointer, touch, keyboard, screen reader, and speech-input labels.

The shared style foundation handles logical direction, focus, and forced-color primitives. Each
component still owns layout and semantic verification for its content.
