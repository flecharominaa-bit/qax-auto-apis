// playwright.config.js
const env = process.env.ENV || 'dev';
require('dotenv').config({ path: `.env.${env}` });

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
    // actionTimeout es la opción que Playwright aplica a los requests del fixture `request`
    actionTimeout: parseInt(process.env.API_TIMEOUT) || 5000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
};
