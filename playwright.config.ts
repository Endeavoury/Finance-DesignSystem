import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/visual-regression.spec.ts',
  expect: { toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 } },
  use: {
    baseURL: 'http://127.0.0.1:6106',
    browserName: 'chromium',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run build-storybook && node scripts/serve-static.mjs storybook-static 6106',
    url: 'http://127.0.0.1:6106/index.json',
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
