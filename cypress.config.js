const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automationteststore.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: "evidencias/screenshots",
    videosFolder: "evidencias/videos",
    trashAssetsBeforeRuns: false,
    retries: { runMode: 1, openMode: 0 },
  },
});
