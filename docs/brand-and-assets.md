# Brand themes, shape, and shared assets

Use `data-ds-brand="finance"` or `data-ds-brand="ontology"` on the application root or a subtree.
Brand themes change semantic accent roles; light, dark, contrast, and forced-color behavior continue
to use the same component contracts. The default brand remains neutral.

Shape roles are control, surface, and overlay. Use them by intent rather than selecting an arbitrary
radius. Expressive shapes are reserved for branded communication and must not reduce density or make
controls harder to identify.

`ds-brand-mark` supplies the shared Kanosis mark and accessible name behavior. `ds-illustration`
provides empty, search, success, and error motifs that inherit the semantic accent palette. Decorative
illustrations are hidden from assistive technology; meaningful variants require a concise `label`.

Do not put product logos, customer assets, or domain diagrams in the generic component bundle. Add a
shared asset only when at least two products use it with the same meaning and ownership.
