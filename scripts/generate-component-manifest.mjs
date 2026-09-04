import { glob, readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

const outputPath = 'docs/component-status.json';
const accessibilityTests = await readFile('tests/accessibility.test.ts', 'utf8');
const behaviorTests = await readFile('tests/components.test.ts', 'utf8');
const visualTests = await readFile('tests/visual-regression.spec.ts', 'utf8');
const storySources = [];
for await (const storyPath of glob('storybook/stories/**/*.stories.ts'))
  storySources.push({ path: storyPath, source: await readFile(storyPath, 'utf8') });
const entries = new Map();
const dedicatedGuides = new Map([
  ['ds-data-table', 'docs/components/data-table.md'],
  ['ds-data-grid', 'docs/components/data-table.md'],
  ['ds-action-bar', 'docs/components/maturity-additions.md'],
  ['ds-brand-mark', 'docs/components/maturity-additions.md'],
  ['ds-chip', 'docs/components/maturity-additions.md'],
  ['ds-illustration', 'docs/components/maturity-additions.md'],
  ['ds-input-group', 'docs/components/maturity-additions.md'],
  ['ds-live-region', 'docs/components/maturity-additions.md'],
  ['ds-reorder-item', 'docs/components/maturity-additions.md'],
  ['ds-reorder-list', 'docs/components/maturity-additions.md'],
  ['ds-segment', 'docs/components/maturity-additions.md'],
  ['ds-segmented-control', 'docs/components/maturity-additions.md'],
  ['ds-split-button', 'docs/components/maturity-additions.md'],
]);
const visualMatrixTags = new Set([
  'ds-action-bar',
  'ds-button',
  'ds-chip',
  'ds-data-table',
  'ds-input',
  'ds-input-group',
  'ds-menu-item',
  'ds-segment',
  'ds-segmented-control',
  'ds-split-button',
]);

for await (const path of glob('packages/components/src/register/*.ts')) {
  const source = await readFile(path, 'utf8');
  const family = basename(path, '.ts');
  for (const match of source.matchAll(/defineComponent\('([^']+)'/g)) {
    const tag = match[1];
    const accessibilityReview = accessibilityTests.includes(`<${tag}`)
      ? 'automated-composition'
      : 'pending-component-matrix';
    const stories = storySources
      .filter((story) => story.source.includes(`<${tag}`))
      .map((story) => story.path);
    const behaviorReview = behaviorTests.includes(`'${tag}'`)
      ? 'automated'
      : 'pending-component-matrix';
    const visualReview = visualMatrixTags.has(tag) && visualTests.includes('toHaveScreenshot')
      ? 'automated-preference-matrix'
      : 'pending-component-matrix';
    const guide = dedicatedGuides.get(tag) ?? null;
    const readiness = {
      productUseCase: family.startsWith('enterprise') || family === 'enhancements' ? 'validation-required' : 'shared-catalog',
      documentation: guide ? 'complete-template' : 'catalog-and-story-only',
      behavior: behaviorReview,
      accessibility: accessibilityReview,
      visualPreferences: visualReview,
    };
    const ready = Object.values(readiness).every((value) =>
      ['shared-catalog', 'complete-template', 'automated', 'automated-composition', 'automated-preference-matrix'].includes(value),
    );
    entries.set(tag, {
      tag,
      family,
      status: ready ? 'ready' : 'experimental',
      owner: 'Kanosis design system',
      adoption: {
        state: readiness.productUseCase,
        evidence: stories,
      },
      accessibilityReview,
      behaviorReview,
      visualReview,
      documentation: {
        catalog: 'docs/component-catalog.md',
        guide,
        stories,
      },
      stateCoverage: {
        default: stories.length ? 'storybook' : 'missing',
        interaction: behaviorReview,
        semantics: accessibilityReview,
        preferences: visualReview,
      },
      readiness,
      stability: ready ? 'Semver protected' : 'Breaking changes allowed before beta',
    });
  }
}

const components = [...entries.values()].sort((left, right) => left.tag.localeCompare(right.tag));
const generated = `${JSON.stringify(
  {
    schemaVersion: 1,
    statuses: ['experimental', 'ready', 'deprecated'],
    generatedFrom: 'packages/components/src/register/*.ts',
    components,
  },
  null,
  2,
)}\n`;

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== generated)
    throw new Error('Component status manifest is stale. Run npm run components:manifest.');
  console.log(`Component status manifest covers ${components.length} registered elements.`);
} else {
  await writeFile(outputPath, generated);
  console.log(`Generated status metadata for ${components.length} registered elements.`);
}
