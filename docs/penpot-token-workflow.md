# Penpot and token synchronization

Penpot owns design intent; `tokens.css` owns released runtime values. The generated TypeScript
metadata and a small reviewable JSON adapter form the interchange boundary.

## Current synchronized workflow

1. Export or record the reviewed Penpot semantic name and per-theme values.
2. Export reviewed sets as `{ "sets": [{ "selector": "…", "values": { "--ds-…": "…" } }] }`.
3. Run `npm run penpot:sync -- path/to/export.json`, then inspect the CSS diff.
4. Run `npm run tokens:generate` to update typed metadata.
5. Run `npm run verify:tokens`, Storybook theme/contrast review, and the full quality gate.
6. Link the Penpot change in release notes.

The importer validates exact CSS selectors and known token names, rejects deprecated aliases, writes
only reviewed values, and never publishes. A Penpot export adapter should produce the JSON shape
above; the deliberately narrow boundary keeps library/API changes out of runtime generation.
