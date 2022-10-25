import { defineConfig } from "cypress";
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      initPlugin(on, config);
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage');
        }

        return launchOptions;
      });
    },
    "baseUrl": 'http://localhost:4200',
    "supportFile": "./src/support/e2e.ts",
    "fileServerFolder": ".",
    "videosFolder": "../../dist/cypress/apps/artemis-web-e2e/videos",
    "screenshotsFolder": "../../dist/cypress/apps/artemis-web-e2e/screenshots",
    "specPattern": "./src/integration/*.spec.{js,jsx,ts,tsx}",
    "video": true,
    "chromeWebSecurity": false,
    "env": {
      "API_KEY": "29870959469dc320ff80c02dcccaf0a62394459e22e6acfdce7cf40f94281d85"
    }
  },
});
