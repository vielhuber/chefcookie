let { defineConfig } = require('cypress');

module.exports = defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: 'http://localhost:18080',
        specPattern: 'cypress/integration/**/*.js',
        supportFile: 'cypress/support/index.js'
    }
});
