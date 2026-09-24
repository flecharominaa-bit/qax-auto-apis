// playwright.config.js
const env = process.env.ENV || 'dev';
require('dotenv').config({ path: `.env.${env}` });

const headers = {
  'Accept': 'application/vnd.github+json',
};

// Solo se envía el token si tiene un valor real
const token = process.env.GITHUB_TOKEN;
if (token && token !== 'PEGAR_AQUI') {
  headers['Authorization'] = `Bearer ${token}`;
}

module.exports = {
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: headers,
    actionTimeout: parseInt(process.env.API_TIMEOUT) || 10000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
};
