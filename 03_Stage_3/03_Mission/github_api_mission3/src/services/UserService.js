// src/services/UserService.js

const { UserResponse } = require('../models/UserResponse');

class UserService {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
    this.endpoint = '/users';
  }

  /**
   * Obtiene la información pública de un usuario.
   * @param {string} username
   * @returns {Promise<{ status: number, body: UserResponse }>}
   */
  async getUser(username) {
    const response = await this.request.get(`${this.endpoint}/${username}`);
    const body = await response.json();
    return {
      status: response.status(),
      body: new UserResponse(body),
    };
  }
}

module.exports = { UserService };
