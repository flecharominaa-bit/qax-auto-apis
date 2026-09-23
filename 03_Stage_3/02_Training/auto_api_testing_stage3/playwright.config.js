// playwright.config.js
require('dotenv').config();

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
  },
  reporter: [['html', { open: 'never' }]],
};
