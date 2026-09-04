# Component maturity and ownership

Every registered element has generated status metadata in
[`component-status.json`](component-status.json). Registration is the source of the component list;
the manifest generator adds family, owner, adoption, accessibility-review, and stability metadata.

## Statuses

| Status | Meaning | Allowed use |
| --- | --- | --- |
| Experimental | The use case and API exist, but one or more readiness checks are incomplete | Product trials with an explicit owner; breaking changes are allowed |
| Ready | The public contract and quality evidence meet the readiness checklist | Recommended for production; semantic versioning protects the contract |
| Deprecated | A supported replacement and removal plan exist | Existing use may migrate; new use is rejected |

## Ready checklist

A component becomes ready only when it has:

1. a stable product use case and a named owning team;
2. an API and state review against the [component documentation template](component-template.md);
3. keyboard, focus, pointer, and event tests for every interaction path;
4. axe coverage for every materially different semantic state;
5. light, dark, increased-contrast, forced-colors, reduced-motion, RTL, text-spacing, and zoom review
   where applicable;
6. compact, medium, and expanded examples with long and localized content;
7. Vanilla, React, and Angular contract verification;
8. Storybook documentation, bundle-budget participation, and migration notes for breaking changes.

Story presence proves discoverability only. It does not imply that this checklist is complete.

## Promotion workflow

1. Prove the behavior in one product and audit similar existing components.
2. Add or update the Web Component contract first.
3. Complete the documentation template, tests, and Storybook matrix.
4. Review accessibility and product adoption evidence.
5. Change status from experimental to ready in the generator's classification rules.

New product-specific primitives should remain in the product until repeated use shows that their
behavior is product-neutral. Framework adapters never promote a component independently from its Web
Component implementation.

## Ownership and review

The Kanosis maintainers own ready components. Experimental components must also name the product
team validating them in an issue or release note. Review the manifest before every minor or major
release and every six months. `npm run verify:components` fails if registered tags and the generated
manifest diverge.
