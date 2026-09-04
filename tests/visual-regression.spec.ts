import { expect, test } from '@playwright/test';

const cases = [
  {
    name: 'actions-light-compact',
    story: 'components-maturity-additions--action-composition',
    width: 390,
    height: 844,
    globals: 'theme:light;contrast:standard;brand:default;direction:ltr',
  },
  {
    name: 'actions-dark-expanded',
    story: 'components-maturity-additions--action-composition',
    width: 900,
    height: 800,
    globals: 'theme:dark;contrast:standard;brand:default;direction:ltr',
  },
  {
    name: 'actions-high-contrast',
    story: 'components-maturity-additions--action-composition',
    width: 768,
    height: 900,
    globals: 'theme:light;contrast:more;brand:default;direction:ltr',
    forcedColors: true,
  },
  {
    name: 'actions-rtl',
    story: 'components-maturity-additions--action-composition',
    width: 768,
    height: 900,
    globals: 'theme:light;contrast:standard;brand:ontology;direction:rtl',
  },
  {
    name: 'list-detail-finance-wide',
    story: 'patterns-adaptive-layouts--list-detail',
    width: 1100,
    height: 800,
    globals: 'theme:light;contrast:standard;brand:finance;direction:ltr',
  },
  {
    name: 'supporting-pane-dark',
    story: 'patterns-adaptive-layouts--supporting-pane',
    width: 900,
    height: 800,
    globals: 'theme:dark;contrast:more;brand:ontology;direction:ltr',
    textSpacing: true,
  },
  {
    name: 'data-table-zoom-reflow',
    story: 'components-data-data-table--long-content-and-overflow',
    width: 390,
    height: 844,
    globals: 'theme:light;contrast:more;brand:finance;direction:ltr',
    zoom: 2,
  },
] as const;

for (const entry of cases) {
  test(entry.name, async ({ page }) => {
    await page.setViewportSize({ width: entry.width, height: entry.height });
    if ('forcedColors' in entry && entry.forcedColors)
      await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(
      `/iframe.html?id=${entry.story}&viewMode=story&globals=${encodeURIComponent(entry.globals)}`,
    );
    await page.locator('#storybook-root').waitFor();
    if ('zoom' in entry && entry.zoom)
      await page.locator('#storybook-root').evaluate((element, zoom) => {
        (element as HTMLElement).style.zoom = String(zoom);
      }, entry.zoom);
    if ('textSpacing' in entry && entry.textSpacing)
      await page.addStyleTag({
        content:
          '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-block-end:2em!important}',
      });
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${entry.name}.png`);
  });
}
