const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;


module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.advantageonlineshopping.com",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', cucumber());
    },
    specPattern: 'cypress/e2e/*.feature', 
  },
  video: false,
});


