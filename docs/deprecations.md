# Deprecation and migration policy

A deprecated token, property, event, tag, or package export must include:

- the supported replacement;
- the version in which deprecation started;
- the earliest possible removal version;
- a migration example and behavior differences;
- a development-only warning when detection is reliable;
- a release-note entry and component-status update.

Ready APIs follow semantic versioning. Removal happens only in a major release. Experimental APIs may
change in a minor release, but release notes still explain the migration. A codemod is required when a
mechanical migration affects several products or more than ten call sites.

The token generator marks legacy breakpoint aliases as deprecated and identifies their replacements
in typed metadata. New code uses compact, medium, expanded, and wide names.
