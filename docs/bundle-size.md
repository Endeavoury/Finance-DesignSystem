# Bundle architecture and measured sizes

`npm run analyze` bundles representative package consumers with Rollup and writes `reports/bundle-sizes.json`. These figures include the Lit runtime and are therefore representative application-entry costs, not just the authored component source.

| Registration entry |       Raw |     Gzip | Raw budget | Gzip budget |
| ------------------ | --------: | -------: | ---------: | ----------: |
| `button`           |  34,883 B | 10,679 B |   45,000 B |    12,000 B |
| `forms`            |  59,060 B | 13,510 B |   70,000 B |    16,500 B |
| `secondary-forms`  |  41,844 B | 11,470 B |   55,000 B |    14,500 B |
| `interaction`      |  34,700 B | 10,744 B |   45,000 B |    12,500 B |
| `overlays`         |  40,306 B | 11,627 B |   55,000 B |    15,000 B |
| `upload`           |  30,093 B |  9,871 B |   40,000 B |    11,500 B |
| `feedback`         |  39,772 B | 11,136 B |   55,000 B |    14,500 B |
| `navigation`       |  45,309 B | 12,541 B |   65,000 B |    16,500 B |
| `tree`             |  27,592 B |  9,379 B |   45,000 B |    12,500 B |
| full library       | 191,477 B | 34,355 B |  210,000 B |    40,000 B |

The analysis also asserts that unique shared control and spinner-foundation markers each occur exactly once in the bundled full-library output. TypeScript runtime helpers use `tslib`, so decorator helpers are imported rather than copied into every component module.

The package publishes unbundled ESM and grouped registration entry points. Consumers can choose a narrow import, allow their application bundler to tree-shake class modules, or register the complete P0/P1 set. The full-entry budget was deliberately raised after adding cross-product tree and semantic-metadata components, while the dedicated tree budget keeps selective navigation imports small. Icons are individual inline SVG templates selected within `ds-icon`; this icon set should be split into per-icon modules if it grows materially.
