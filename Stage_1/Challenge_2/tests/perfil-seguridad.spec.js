const { test, expect } = require('@playwright/test');

const baseURL = 'https://practice.expandtesting.com/notes/api';

let token;
let userEmail;
let userPassword = 'Password123!';

test.describe('Perfil y Seguridad', () => {

  test.beforeAll(async ({ request }) => {
    userEmail = `ninja_${Date.now()}@test.com`;

    // Registrar usuario
    await request.post(`${baseURL}/users/register`, {
      data: {
        name: 'Romi Tester',
        email: userEmail,
        password: userPassword
      }
    });

    // Login
    const loginResponse = await request.post(`${baseURL}/users/login`, {
      data: {
        email: userEmail,
        password: userPassword
      }
    });

    const body = await loginResponse.json();
console.log("LOGIN RESPONSE:", body);


    token = body.data.token || body.token;

console.log("TOKEN:", token);
  });

  test('Obtener perfil', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/profile`, {
      headers: {
        'x-auth-token': token
      }
    });

    expect(response.status()).toBe(200);
  });

  test('Cambiar password', async ({ request }) => {
    const response = await request.post(`${baseURL}/users/change-password`, {
      headers: {
        'x-auth-token': token
      },
      data: {
        currentPassword: userPassword,
        newPassword: 'NewPassword123!'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('Forgot password', async ({ request }) => {
    const response = await request.post(`${baseURL}/users/forgot-password`, {
      data: {
        email: userEmail
      }
    });

    expect(response.status()).toBe(200);
  });

  test('Verify token inválido', async ({ request }) => {
    const response = await request.post(`${baseURL}/users/verify-reset-password-token`, {
      data: {
        token: 'invalid_token'
      }
    });

    expect(response.status()).toBe(401);
  });

  test('Reset password inválido', async ({ request }) => {
    const response = await request.post(`${baseURL}/users/reset-password`, {
      data: {
        token: 'invalid_token',
        newPassword: 'NewPassword123!'
      }
    });

    expect(response.status()).toBe(400);
  });

});